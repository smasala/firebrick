/**
* Firebrick JS - JavaScript MVC Framework powered by jQuery, Bootstrap and Knockout JS
* Author: Steven Masala
* dependencies: jquery, bootstrap, knockout js
* contact: me@smasala.com
*/ 

(function(root, factory) {
	
  "use strict";

  if (typeof define === "function" && define.amd) {
    define(["jquery", "knockout", "knockout-mapping"], function($, ko, kom) {
    	ko.mapping = kom;
    	return factory($, ko);
    });
  } else {
    factory(root.jQuery, root.ko);
  }

}(this, function($, ko) {
	if(window.Firebrick || window.fb){
		console.error("unable to initialise FirebrickJS, window.Firebrick or window.fb are already defined");
		return;
	}

	var Firebrick = {
		
		version: "0.8.4",

		/**
		* used to store configurations set Firebrick.ready()
		* @private
		*/
		app: {
			name: "",
			path: ""
		},
		
		/** ready function to kick start the application
		* @fires main-viewRendered || view object
		* @param options :: object = {
					go:function(), //called on document ready
					app:{
						name: string, //name of the app
						path: string //path of the app
					},
					autoRender: boolean //whether to call first view automatically  "{app.name}.view.Index",
					viewData: object //viewData to be passed to the autoRender view,
					splash: string //html or string to be rendered before the document is loaded - removed on document.ready
					require:string or array of string //these file(s) are required
					cache: boolean default true - whether require should cache files or not,
					lang: language file name or store,
					dev: default false, true to print requirejs exceptions to console
				}
		*/
		ready: function(options){
			var me = this;
				me.app = options.app;
			
			me.utils.initSplash(options.splash || me.templates.loadingTpl);

			Firebrick.boot.prepApplication(options);
			
			//if files need to be required first, then require them and fire the application
			if(options.require && options.require.length > 0){
			
				if(!$.isArray(options.require)){
					//convert to array if no already
					options.require = [options.require];
				}

				require(options.require, function(){
					me.utils.clearSplash();
					var args = arguments;
					$(document).ready(function(){
						if(options.autoRender !== false){
							Firebrick.views.bootView(options);
						}
						options.go.apply(options.go, args);
					});
				});
			
			}else{
				me.utils.clearSplash();
				$(document).ready(function(){
					if(options.autoRender !== false){
						Firebrick.views.bootView(options);
					}
					options.go()
				});
			}
		},
		
		/** SHORTCUTS **/
		shortcut: function(scope, func, args){
			return scope[func].apply(scope, args);
		},
		
		get: function(){
			return this.shortcut(this.classes, "get", arguments);
		},
		
		getById: function(){
			return this.shortcut(this.classes, "getById", arguments);
		},
		
		create: function(){
			return this.shortcut(this.classes, "create", arguments);
		},
		
		define: function(){
			return this.shortcut(this.classes, "define", arguments);
		},
		
		createController: function(){
			return this.shortcut(this.controllers, "createController", arguments);
		},
		
		require: function(){
			return this.shortcut(this.utils, "require", arguments);
		},
		
		loadRaw: function(){
			return this.shortcut(this.views, "loadRaw", arguments);
		},
		
		createView: function(){
			return this.shortcut(this.views, "createView", arguments);
		},
		
		defineView: function(){
			return this.shortcut(this.views, "defineView", arguments);
		},
		
		getBody: function(){
			return this.shortcut(this.views, "getBody", arguments);
		},
		
		delay: function(){
			return this.shortcut(this.utils, "delay", arguments);
		},
		
		addListener: function(){
			return this.shortcut(this.events, "addListener", arguments);
		},
		
		removeListener: function(){
			return this.shortcut(this.events, "removeListener", arguments);
		},
		
		fireEvent: function(){
			return this.shortcut(this.events, "fireEvent", arguments);
		},
		
		on: function(){
			return this.shortcut(this.events, "on", arguments);
		},
		
		off: function(){
			return this.shortcut(this.events, "off", arguments);
		},
		
		createStore: function(){
			return this.shortcut(this.data.store, "createStore", arguments);
		},
		
		text: function(){
			return this.shortcut(this.languages, "getByKey", arguments); 
		},
		/** END OF SHORTCUTS **/
		
		classes: {
		
			/**
			* Class Registry
			* @private
			*/
			classRegistry: {},
			
			/**
			* get or returns a firebrick class by name
			* @param name :: string
			* @param config :: object
			* @returns object
			*/
			get: function(name){
				return this.classRegistry[name];
			},
			
			/**
			 * get a class by classId
			 * @param string
			 * @return object
			 */
			getById: function(id){
				var me = this,
					clazz;
				$.each(me.classRegistry, function(k,v){
					if(v._classId && v.getClassId && v.getClassId() == id){
						clazz = v;
						//found class, stop iteration
						return false;
					}
				});
				
				return clazz;
			},
			
			/**
			 * pass a simple object and a super class that you wish to extend from OOP
			 * @param obj :: plain object
			 * @param _super :: object class
			 * @return obj prototype of _super (i.e. obj which extends from _super
			 */
			extend: function(obj, _super){
				var clazz;
				//iterate over all obj parameters
				for(p in obj){
					if(obj.hasOwnProperty(p)){
						//replace the property with a descriptor object
						obj[p] = Object.getOwnPropertyDescriptor(obj, p);
						//if the property is found in the super class and is a function
						if(_super[p] && $.isFunction(_super[p])){
							//enable the function to call its super function by calling this.callParent
							obj[p].value = (function(func, parent){
								return function(){
									this.callParent = parent;
		                            var r = func.apply(this, arguments);
		                            delete this.callParent;
		                            return r;
		                        }
	                    	})(obj[p].value, _super[p]);
		               }                
					}
	        	}
				//create a tmp version of the super object
		        var tmp = Object.create(_super);
		        //create a new object with the descriptors that inherit from super
		        return Object.create(Object.getPrototypeOf(tmp), obj);
			},
			
			/**
			* get or returns a firebrick class by name and calls init()
			* @param name :: string
			* @param config :: object
			* @returns object
			*/
			create: function(name, config){
				var me = this,
					clazz;
			    if(me.classRegistry[name]){
			        clazz = me.extend(config, me.classRegistry[name]);
			    }else{
			        clazz = me.define(name, config);
			    }

			    if(clazz.init){
			    	clazz.init();
			    }
			    
			    return clazz;
			},
			
			/**
			* define a firebrick class
			* @param name :: string
			* @param config :: object :: optional
			* @returns the newly created class
			*/
			define: function(name, config){
				var me = this,
					clazz;
			    
				config._classname = name;
			    
			    if(config.extend){
			        var _super = me.classRegistry[config.extend];
			        clazz = me.extend(config, _super);
			    }else{
			        clazz = Object.create(config);
			    }
			    me.classRegistry[name] = clazz;
			    return clazz;
				
			}
			
		},
		
		controllers:{
			
			createController: function(name, config){
				config = config || {};
				config.extend = "Firebrick.controller.Base";
				return Firebrick.create(name, config);
			}
			
		},
		
		templates:{
			/**
			 * General loading tpl
			 * @private
			 */
			loadingTpl: "<div class='fb-view-loader'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></div>",
		},
		
		views: {
			
			bootView: function(options){
				Firebrick.utils.clearSplash();
				return Firebrick.createView(Firebrick.app.name + ".view.Index", {
					target:"body", 
					store:options.viewData, 
					async:true,
					listeners:{
						"ready": function(){
							Firebrick.fireEvent("viewReady", this);
						}
					}
				});
			},
			
			/**
			* Create and render a view
			* @param name :: string :: MyApp.view.MyView
			* @param config :: object (optional) :: object to config the View class with
			* @returns Firebrick.view.Base || object
			**/
			createView: function(name, config){
				config = this.basicViewConfigurations(config);
				return Firebrick.create(name, config);
			},
			/**
			* Note: different to Firebrick.define() for classes -
			* Firebrick.defineView, defines and fetches if not already loaded the given view by name
			* @param name :: string :: name of the view to me shown "MyApp.view.MyView"
			* @param config :: object (optional) :: object to config the View class with
			* @returns Firebrick.view.Base :: object
			*/
			defineView: function(name, config){
				var me = this;
				config = me.basicViewConfigurations(config);
				return Firebrick.define(name, config);
			},
			
			/**
			 * initialise subviews of a view
			 * @private
			 * @param view :: view object
			 * @returns view
			 */
			initSubViews:function(view){
				var me = this,
					subViews = view.subViews;
				if(subViews){
					if($.isArray(subViews)){
						$.each(subViews, function(i,v){
							view.subViews[i] = me.internal_loadSubView(v);
						});
					}else{
						view.subViews = me.internal_loadSubView(subViews);
					}
				}
				
				return view;
			},
			
			/**
			 * used by initSubViews
			 * @private
			 */
			internal_loadSubView: function(subView){
				if($.type(subView) == "string"){
					subView = Firebrick.createView(subView, {autoRender:false});
				}else if($.isPlainObject(subView)){
					if(subView.isView){
						if(subView._state == "unbound"){
							subView = subView.render();
						}else{
							var a = Firebrick.createView(subView._classname);
							subView = a;
							Firebrick.classes.classRegistry[subView._classname] = a;
						}
						
					}
				}
				return subView;
			},
			
			/**
			 * load html file raw
			 */
			loadRaw: function(name){
				var me = this,
					raw;
				Firebrick.utils.require(name, function(r){
					raw = r;
				}, false, "html", "html");
				return raw;
			},
			
			/**
			* Basic view configurations when defining/creating a view
			* @private
			* @param config :: object (optional)
			* @returns object
			*/
			basicViewConfigurations: function(config){
				var me = this;
				config = config || {};
				if(!config.extend){
					config.extend = "Firebrick.view.Base";
				}
				return config;
			},
			
			/**
			* jQuery body object (cache) - is set initally by getBody()
			* @private
			*/
			body: null,
			
			/**
			* Shortcut to get jQuery("body")
			* @param refresh :: boolean (optional) :: defaults to false - if true gets the body object fresh and not from cache
			* @returns jquery object of body
			*/
			getBody: function(refresh){
				var me = this;
				if(refresh === true || !me.body){
					me.body = $("body");
				}
				return me.body;
			},
			
			/**
			* find the target using a selector - same as jQuery(selector)
			* @param selector :: string || jquery object
			* @returns jquery object || null
			*/
			getTarget: function(selector){
				var a = selector && selector.jquery ? selector : $(selector);
				return a.length > 0 ? a : null;
			},
			
			/**
			* Render HTML or Template to the given target
			* @private
			* @param target :: jquery object ::
			* @param html :: string :: template or html
			* @returns target as jquery object
			*/
			renderTo:function(target, html){
				return target.html(html);
			}
			
		},
		
		boot:{
			prepApplication: function(options){
				if(options.cache === false){
					require.config({
					    urlArgs: "fb=" + (new Date()).getTime()
					});
					$.ajaxSetup({cache: false});
				}
				
				if(options.dev){
					requirejs.onError = function (err) {
					    
					    if (err.requireType === 'timeout') {
					        console.log('modules: ' + err.requireModules);
					    }else{
					    	console.error(err.message);
					    }

					};
				}
				
				if(options.lang){
					Firebrick.languages.init(options.lang);
				}
				
			}
		},
		
		utils: {
		
			/**
			 * keep track of all require requests
			 * @private
			 */
			requiredFiles:{},
			
			/**
			 * keep track of all the interval functions running
			 * @private
			 */
			intervalRegistry:{},
			
			/**
			 * @private
			 * used by init&Clear Splash
			 */
			splashCleared: false, 
			
			/**
			 * html is appended to the html tag before the document is ready 
			 * @usage splash paramter with Firebrick.ready({splash:html});
			 * @private
			 * @param html :: string
			 */
			initSplash: function(html){
				var me = this;
				Firebrick.delay(function(){
					if(!me.splashCleared){
						$("html").append("<div id='fb-splash'>" + html + "</div>");
					}
				}, 1);
			},
			
			clearSplash: function(){
				this.splashCleared = true;
				$("#fb-splash").remove();
			},
			
			/**
			* extend class 1 with properties of class 2
			* @param config :: object :: object to extend
			* @param obj2 :: object :: properties to extend from 
			* @returns merged object
			*/
			extend: function(config, obj2){
				var me = this;
				$.each(obj2, function(key, value){
					//doesn't exist then copy it over
					if(!config.hasOwnProperty(key)){
						config[key] = value;
					}else{
						//does exists
						//is a function
						if($.isFunction(config[key])){
							//enable function to call its obj2 : http://stackoverflow.com/a/22073649/425226
							//TODO: stop recursion on itself when obj2 has no callParent	
							(function(current, parent){
								config[key] =  function() { // inherit
											this.callParent = parent;
											var res = current.apply(this, arguments);
											delete this.callParent;
											return res;
										};
							})(config[key], value);
						}
					}
				});
				return config;
			},
			
			/**
			* overwrite properties in the first object from that of the second
			* @param obj1 :: object
			* @param obj2 :: object
			* @returns object
			*/
			overwrite: function(obj1, obj2){
				$.each(obj2, function(k,v){
					obj1[k] = v;
				});
				return obj1;
			},
			
			/**
			*	Javascript setTimout function
			* @usage delay(function(){}, 1000, scope);
			* @param callback :: function
			* @param timeout :: integer :: miliseconds
			* @param args :: any :: pass to delay function
			* @param scope :: object (optional) :: scope of the callback function. Defaults to: window
			*/
			delay: function(callback, timeout, args, scope){
				setTimeout(function(args1){
					callback.apply(scope || this, args1);
				}, timeout, args);
			},
			
			/**
			 * clear the interval running by id
			 */
			clearInterval:function(id){
				var me = this,
					func = me.intervalRegistry[id];
				if(func){
					window.clearInterval(func.intId);
					delete this.intervalRegistry[id];
				}
			},
			
			/**
			 * set an interval and prevent any duplicates
			 * @param id :: string (optional)
			 * @param callback :: function
			 * @param timeout :: int :: miliseconds
			 * @param scope :: object :: scope to apply to the callback
			 */
			setInterval: function(){
				var me = this,
					fArg = arguments[0],
					id = $.isFunction(fArg) ? fArg.id : fArg,
          newId;
				
				if(!me.isIntervalRunning(id)){
					if($.isFunction(fArg)){
						newId = me.int_applyInterval(null, arguments[0], arguments[1], arguments[2]);
					}else{
						newId = me.int_applyInterval.apply(this, arguments);
					}
				}
				
				return newId;
			},
			
			/**
			 * @private use setInterval()
			 * @param id :: string (optional)
			 * @return id :: string
			 */
			int_applyInterval: function(id, callback, interval, scope){
				var me = this;
					id = id || me.uniqId();
				
				var f = function(){
					callback.id = id;
					callback.apply(scope || callback, arguments);
				};
				
				//start the interval
				f.intId = window.setInterval(f, interval);
				
				//register the interval function
				me.intervalRegistry[id] = f;
				//return the id
				return id;
			},
			
			/**
			 * Check whether interval already exists
			 * @param id :: string
			 */
			isIntervalRunning: function(id){
				return this.intervalRegistry[id];
			},
		
			/**
			* Basic clone from one object to a new one object
			* @param object :: object :: object you wish to clone
			* @param config :: object :: new properties you wish to add to the clone
			* @returns object :: new object clone
			*/
			clone: function(object, config){
				var clone = {};
        config = config || {};
				$.each(object, function(key, value){
					clone[key] = value;
				});
				$.each(config, function(key, value){
					clone[key] = value;
				});
				return clone;
			},
		
			/**
			* Get a script/file from path
			* @usage require("MyApp.controller.MyController", function(){}, true, "html", "js");
			* @param name :: string || [string] :: MyApp.controller.MyController
			* @param callback :: function (optional) :: called when last require has completed or failed
			* @param async :: boolean :: defaults true
			* @param data_type :: string :: jQuery ajax datatype. defauts to 'script'
			* @param ext :: string :: file extension. defaults to 'js'
			* @returns the files that were eventually loaded
			*/
			require: function(names, callback, async, data_type, ext){
				var me = this, 
					path;
					
       	data_type = data_type || "script";
				ext = ext || "js"; 
				
				if(!$.isArray(names)){
					names = [names];
				}
				
				//filter out requires that have already been called before
				var unFilterednames = names;
				names = unFilterednames.filter(function(value){
					return !me.requiredFiles[value];
				});
				
				//mark how files are to be fetched
				var ajaxCounter = names.length,
					//prepare callback function
					newCallback = function(){
						ajaxCounter--;
						if(ajaxCounter === 0){
							if(callback && $.isFunction(callback)){
								callback.apply(this, arguments);
							}
						}
					};

        //iterate of each file and get them
        $.each(names, function(index, name){
          //convert the name into the correct path
					me.requiredFiles[name] = true;
					path = me.getPathFromName(name, ext);
					$.ajax({
						async:$.type(async) == "boolean" ? async : true,
						dataType:data_type,
						url:path,
						success:function(){
							newCallback.apply(this, arguments);
						},
						error:function(reponse, error, errorMessage){
							console.warn("unable to load file/class '", name, "' at:", path);
							console.error(error, errorMessage);
							newCallback.apply(this, arguments);
						}
					});
        });
				
				return names;
			},
			
			/**
			* Converts a name like "MyApp.controller.MyController" to a path MyApp/controller/MyController
			* @private
			* @param name :: string
			* @param ext :: string :: default to 'js'
			* @returns string
			*/
			getPathFromName: function(name, ext){
				var me = this,
					homePath = Firebrick.app.path,
					appName = Firebrick.app.name;
        
					ext = ext || "js";
				
				//check whether user has added the trailing / to the path
				if(homePath.charAt(homePath.length-1) == "/"){
					//remove the last "/" from path as it is added later on by name.replace
					homePath = homePath.substr(0, homePath.length-1);
				}
				
				name = name.trim();
				
				if(name.indexOf(".") > 0){
					//check if the appName is found at the beginning
					if(name.indexOf(appName) === 0){
						//replace the appName with the target path
						name = name.replace(appName, homePath);
						//replace all . with /
						return name.replace(/\./g, "/") + "." + ext;
					}
				}
				
				//local file
				return homePath + "/" + name;
			},
			
			/**
			*	returns a unique id: http://stackoverflow.com/a/19223188
			* @private
			*/
			globalC: 1,
			uniqId: function() {
				var me = this,
					d = new Date(),
					m = d.getMilliseconds() + "",
					u = ++d + m + (++me.globalC === 10000 ? (me.globalC = 1) : me.globalC);

				return u;
			},
			
			loadCSS: function(url) {
			    var link = document.createElement("link");
			    link.type = "text/css";
			    link.rel = "stylesheet";
			    link.href = url;
			    document.getElementsByTagName("head")[0].appendChild(link);
			}
			
		},
		
		languages:{
			
			/**
			 * @private
			 * use get/setLang() to change the language
			 */
			lang: ko.observable("en"),
			
			/**
			 * store of keys
			 * @private
			 */
			keys:ko.observable({}),
			
			/**
			 * initial the language keys
			 * @private
			 * @use Firebrick.ready({lang:...}) to set language
			 * @param lang :: string or store object :: string = url to load
			 */
			init:function(lang){
				var me = this;
				if($.type(lang) == "string"){
					Firebrick.createStore({
						url:lang,
						autoLoad:false,
					}).load({
						callback:function(){
							me.keys(this.getData());
						}
					});
				}else if(lang.isStore){
					me.keys = lang.getData();
				}else{
					console.error("unable to load languages", lang);
				}
			},
			
			/**
			 * get text by its key
			 * @param key :: string
			 * @returns string
			 */
			getByKey: function(key){
        key = key.toLowerCase();
				var me = this,
            a = me.keys()[me.lang()];
				return a && a[key] ? a[key] : key;
			},
			
			/**
			 * set the app language
			 * @param langKey :: string
			 */
			setLang: function(langKey){
				this.lang(langKey);
			},
			
			/**
			 * get Lang as string
			 * @returns string
			 */
			getLang: function(){
				return this.lang();
			},
			
			/**
			 * available langages
			 * @returns array of strings :: all possible languages
			 */
			allLanguages: function(){
				var me = this,
					langs = [];
				$.each(ko.mapping.toJS(me.keys), function(lang){	//lang, keys
					langs.push(lang);
				});
				return langs;
			}
			
		},
		
		events: {
			
			/**
			* Event registry
			* @private
			*/
			eventRegistry: {},
			
			/**
			* Event Counter - used to make callbacks by id
			* @private
			*/
			eventCounter: 0,
			
			/**
			* add a listener to a specific event by name
			* @usage addListener("myEvent", myFunction(){}, this);
			* @usage addListener({
						"myEvent": function(){},
						"mySecondEvent": function(){},
						scope: this
					})
			* @param eventName :: string || object
			* @param callback :: function
			* @param scope :: object (optional) :: scope in which the listener is fired in
			* @returns the function with the assigned callbackId;
			*/
			addListener: function(eventName, callback, scope){
				var me = this;
				
				if($.isPlainObject(eventName)){
					return me.addListener_internal(eventName);
				}
				
				if(!callback.conf){
					callback.conf = {};
					callback.conf.callbackId = me.eventCounter++;
				}
				
				callback.conf.scope = scope;
				
				if(!me.eventRegistry[eventName]){
					//no listeners under this event name yet
					me.eventRegistry[eventName] = [];
				}
				
				me.eventRegistry[eventName].push(callback);
				return callback;
			},
			
			/**
			* Use Firebrick.events.addListeners
			* @private
			* @usage addListeners_internal({
					"myEvent": function(){},
					"mySecondEvent": function(){},
					scope: this
				})
			* @param object :: object
			*/
			addListener_internal: function(object){
				var me = this, scope = object.scope;
				delete object.scope;
				$.each(object, function(eventName, callback){
					me.addListener(eventName, callback, scope);
				});
			},
			
			/**
			* remove listener by eventName and function
			* @usage removeListener("myEvent", function);
			* @param eventName :: string
			* @param function :: optional :: if non given will remove all listeners for event
			*/
			removeListener: function(eventName, funct){
				var me = this, reg = me.eventRegistry[eventName];
				if(reg){
					if(funct.conf.callbackId || funct.conf.callbackId === 0){
						for(var i = 0, l = reg.length; i<l; i++){
							//compare callbackId's
							if(reg[i].conf.callbackId == funct.conf.callbackId){
								//function found so remove from array of listeners
								reg.splice(i, 1);
								if(reg.length === 0){
									delete me.eventRegistry[eventName];
								}
							}
						}
					}else{
						console.warn("No callbackId for function whilst trying to remove listener");
					}
				}else{
					console.warn("Unable to remove listener. No events found for:", eventName);
				}
			},
			
			/**
			* Fire an event by name
			* @usage fireEvent("eventFired", 1, "test", false);
			* @param eventName :: string
			* @param data :: any... :: arguments passed to event when fired
			*/
			fireEvent: function(eventName){
				var me = this, reg = me.eventRegistry[eventName];
				if(reg){
					//get the argument from this function call
					var args = [].splice.call(arguments, 1),
						ev = me.createEventData(eventName);	//create an event object to pass to the function argument

					for(var i = 0, l = reg.length; i<l; i++){
						var f = reg[i];
						//copy the function config created by addListener into the event argument and the function itself
						ev.conf = f.conf;
						ev.funct = f;
						//place the event object as the first item in arguments list
						args.unshift(ev);
						//call the event with the new arguments
						f.apply(f.conf.scope || window, args);
					}
				}
			},
			
			/**
			* creates the event object to be passed as argument when event is fired
			* @private
			* @param eventName :: string
			*/
			createEventData: function(eventName){
				var me = this, ev = {
					event: eventName, 
					conf: null,
					/**
					* removes the listener it called from within
					* @usage event.removeSelf();
					*/
					removeSelf: function(){
						me.removeListener(eventName, ev.funct);
					}
				};
				
				return ev;
			},
			
			/**
			* Define events and their callbacks, similar to $(selector).on(eventname, callback)
			* @usage on("click", "a.mylink", function(){})
			* @usage on({
							"a.link":{
								click:function(){},
								mouseover:function(){}
							},
							scope:this
						})
			* @param eventName :: string ||  object || same as jquery selector(s)
			* @param selector :: string (optional) :: use if first arg is not an object
			* @param callback :: function (optional) :: use if first arg is not an object
			* @param scope :: object (optional) :: change scope on callback function use if first arg is not an object
			*/
			on: function(eventName, selector, callback, scope){
				var me = this;
				//if the eventName is an object
				if($.isPlainObject(eventName)){
					return me.on_internal(eventName);
				}
				//register single event
				return me.register_on_event(eventName, selector, callback, scope);
			},
			
			/**
			* Makes use of the jQuery .off() function
			* @usage .off( "click", "#theone", function(){} )
			* @param selector :: string
			* @param eventName :: string
			* @param callback :: function :: the function used in on()
			*/
			off: function(eventName, selector, callback){
				$(document.body).off(eventName, selector, callback);
			},
			
			/**
			* use Firebrick.events.on()
			* @param object :: object :: {
							"a.link":{
								click:function(){},
								mouseover:function(){}
							},
							scope:this
						}
			* @private
			**/
			on_internal: function(object){
				var me = this, scope = object.scope;
				$.each(object, function(selector, value){
					if(selector != "scope"){
						$.each(value, function(eventName, callback){
							me.register_on_event(eventName, selector, callback, scope);
						});
					}
				});
			},
			
			/**
			* use Firebrick.events.on()
			* @private
			*/
			register_on_event: function(eventName, selector, callback, scope){
				$(document).on(eventName, selector, function(){
					//add scope as last argument, just in case the scope of the function is changed
					var args = [].splice.call(arguments, 0);
					args.push(this);
					callback.apply(scope || this, args);
				});
			}
			
		},
		
		data: {
			
			//store functions
			store: {
				
				/**
				* creates a new Firebrick.store.Base store to be used OR if a name and config are supplied, then Firebrick.create() is called
				* @usage createStore({
							data:{name:"bob"}
						}); :: creates a new class Firebrick.store.Base to be used
				* @usage createStore("MyApp.store.MyStore", {}); :: Firebrick.create() is called
				* @usage createStore() :: returns a Store class to be used
				* @param name || config :: string (optional) || object :: if string, then Firebrick.create(name, config) is called
				* @param config :: object (optional) :: data to config the class with - called in conjuction when name is set
				* @returns Firebrick.store.Base
				*/
				createStore:function(name, config){
					var me = this; 
					
					//name is a string - hence the user is looking to create an actual defined store
					if($.type(name) == "string"){
						//return the created class
						var clazz = Firebrick.get(name);
						if(clazz){
							clazz = Firebrick.classes.extend(config, clazz);
							clazz.init();
						}else{
							config = me.basicStoreConfigurations(config);
							clazz = Firebrick.create(name, config);
						}
						return clazz;
					}else{
						//only 1 parameter in this case, name is then config.
						config = name || {};
						var _super = Firebrick.get("Firebrick.store.Base");
						//return a new object based on the Base class
						return Firebrick.classes.extend(config, _super).init();
					}
				},
				
				/**
				* Basic view configurations when defining/creating a view
				* @private
				* @param config :: object (optional)
				* @returns object
				*/
				basicStoreConfigurations: function(config){
					var me = this;
					config = config || {};
					if(!config.extend){
						config.extend = "Firebrick.store.Base";
					}
					return config;
				},
				
				/**
				* Used by Firebrick.store.Base.load();
				* @private
				* @param store = Firebrick.store.Base object
				* @param options :: object :: {async:boolean (optional - default store.async), callback:function(store, jsonObject, status, response), scope: object}
				* @return store
				**/
				loadStore: function(store, options){
					options = options || {};
					var me = this, 
						url = store.url,       
						async = options.async;
					
					if($.type(async) != "boolean"){
						async = store.async;
					}
						
					if($.isPlainObject(url)){
						url = url.get;
					}					
					
					store.status = "preload";

					$.ajax({
						datatype: store.datatype,
						async: async,
						url: store.url,
						success:function(jsonObject, status, response){
							store.setData(jsonObject);
							store.status = status;
							if($.isFunction(options.callback)){
								options.callback.apply(options.scope || store, [store, jsonObject, status, response]);
							}
						},
						error:function(reponse, error, errorMessage){
							console.warn("unable to load store '", store.classname, "' with path:", store.url);
							console.error(error, errorMessage);
						}
					});
					
					return store;
				},
				
				/**
				* Submit the given store with its data to the specified url
				* @private
				* @param store :: Firebricks.store.Base class
				* @param callback :: function (optional) :: function to call on store submission success
				* @returns store
				*/
				submit: function(store, callback){
					var me = this,
						data;
					
					if(store && store.url && store.url.submit){
						
						store.status = "presubmit";
					
						data = store.toJson();
						$.ajax({
							url: store.url.submit,
							data: {data: store.toJson()},
							type: store.protocol,
							beforeSend: function(){
								return store.fireEvent("beforeSubmit", store, data);
							},
							success: function(data, status, response){
								store.status = status;
								if(callback){
									callback.apply(store, arguments);
								}
							},
							error: function(){
								console.error("error submitting data for store to url", store.url.submit, store);
							}
						});
					}else{
						console.error("unable to submit store, no submit path found (url.submit)", store);
					}
					
					return store;
				},
				
			}
			
		},
		
		router:{
			
			/**
			 * set route definitions
			 * @usage Firebrick.router.set({
			 * 		"users/abc": function(){},
			 * 		"contact": function(){}
			 * })
			 * @usage: Firebrick.router.set(function(){}) //call function regardless of route
			 * @params config :: object
			 * @param callback :: function (optional)
			 */
			set: function(config){
				var me = this,
					route = function(){};
				
				if($.isFunction(config)){
					//one argument given, simple callback regardless of hash change
					route = config;
				}else{
					if($.isPlainObject(config)){
						route = function(){
							$.each(config, function(hash, cb){
								if(Firebrick.router.is("#" + hash)){
									cb.apply(this, arguments);
									return false;
								}
							});
						};
					}
				}
					
					
				return me.onHashChange(route);
			},
		
			/**
			* Call a function when the hash changes on the site
			* @usage Firebrick.router
			* @private || use Firebrick.route.set()
			* @param config
			* @param callback
			*/
			onHashChange: function(callback){
				return $(window).on("hashchange", function(){
					callback.apply(this, arguments);
				});
			},
		
			/**
			* Check whether the pattern or hash is present
			* @usage Firebrick.router.is("#/completed") :: returns true or false
			* @param pattern :: string
			* @returns boolean
			*/
			is: function(pattern){
				if(pattern.contains("#")){
					return window.location.hash == pattern;
				}
				
				return window.location.href.replace(window.location.origin) == pattern;
			}
		
		}
		
	};
	
	Firebrick.define("Firebrick.class.Base", {

		init:function(){
			//inits of all inits :)
			var me = this;
			if(me.listeners){
				me.on(me.listeners);
			}
			me.fireEvent(me.overrideReadyEvent || "ready");
			return me;
		},
		
		/**
		 * @private use getClassId()
		 */
		_classId:null,
		/**
		 * event registry
		 * @private
		 */
		//localEventRegistry: null,

		/**
		 * get the id for the current class
		 * @returns string
		 */
		getClassId: function(){
			if(!this._classId){
				//generate an id if it doesnt have one already
				this._classId = "fb-" + Firebrick.utils.uniqId();
			}
			return this._classId;
		},
		
		/**
		 * shorthand for defining class listeners so you don't have to create the init function and us this.on()
		 * @usage: listeners:{
		 * 				"ready": function(){},
		 * 				scope:this
		 * 			}
		 */
		listeners:null,
	
		/**
		* register a listener to this object, when the object fires a specific event
		* @usage .on("someEvent", callback)
		* @usage .on({
		*     "someevent": callback,
		*     "someotherevent": callback1
		* })
		* @param eventName :: string
		* @param callback :: function
		* @param scope :: object (optional)
		* @returns self
		*/
		on: function(eventName, callback, scope){
			var me = this;
			
			if(!me.localEventRegistry){
				me.localEventRegistry = {};
			}
			
			var addEvent = function(eventName, func, sc){
				//init the registry
				if(!me.localEventRegistry[eventName]){
					me.localEventRegistry[eventName] = [];
				}
				//give the function an id
				func.id = Firebrick.utils.uniqId();
				if(sc){
					//add the scope if needed
					func.scope = sc;
				}
				me.localEventRegistry[eventName].push(func);
			};
			
			if($.isPlainObject(eventName)){
				//first argument is an object
				var s = eventName.scope;
				$.each(eventName, function(k,v){
					if(k !== "scope"){
						addEvent(k, v, s);
					}
				});
			}else{
				//just add the event
				addEvent(eventName, callback, scope);
			}
			
			return me;
		},
		
		/**
		* remove a listener that was registered with .on()
		* @param eventName :: string
		* @param callback :: function :: the function that was used during .on()
		* @returns self
		*/
		off: function(eventName, callback){
			var me = this;
			if(me.localEventRegistry && me.localEventRegistry[eventName]){
				$.each(me.localEventRegistry[eventName], function(i, func){
					if(func.id == callback.id){
						me.localEventRegistry[eventName].splice(i, 1);
						return false;
					}
				});
			}
			return me;
		},
		
		/**
		* Fire an event on this object
		* @param eventName :: string :: name of the event to fire`
		* @param args :: any... (optional)
		* @returns self
		*/
		fireEvent: function(){
			var me = this,
				events = me.localEventRegistry,
				args = arguments, 
				eventName = arguments[0];	//get first argument - i.e. the event name
			if(events && events[eventName]){
				$.each(events[eventName], function(i, func){
					func.apply(func.scope || func, args);
				});
			}
			return me;
		}
	});
	
	Firebrick.define("Firebrick.view.Base", {
		extend:"Firebrick.class.Base",
		/**
		* set when the view is loaded by the ajax request
		* @private
		*/
		tpl: "",
		/**
		 * bind a store or plain data to the view
		 */
		store:null,
		/**
		* parsed html using the tpl and data
		*/
		html:"",
		/**
		* Target to which to render the html content
		* string || object :: jquery selector || jquery object
		*/
		target:null,
		/**
		* render the view on class creation
		*/
		autoRender:true,
		/**
		* controller to bind to the view
		* string || object :: name of the controller || controller class itself
		*/
		controller: null,
		/**
		 * loading template - loaded into target is showLoading == true
		 */
		loadingTpl: Firebrick.templates.loadingTpl,
		/**
		 * whether the loader is being shown or not
		 * @private
		 */
		loading: false,
		/**
		 * whether to show that the view is loading
		 */
		showLoading: true,
		/**
		* State the view is current in. "Initial", "Rendered"
		* @private
		*/
		_state:"initial",
		/**
		 * define subviews to load after creation of this view
		 * string / array of strings / object / array of objects
		 * @usage subViews: MyApp.view.MyView
		 * @usage subViews: ["MyApp.view.MyView", "MyApp.view.MyView1"]
		 * @usage subViews: Firebrick.defineView(...)
		 * @usage subViews: [Firebrick.defineView(...), Firebrick.defineView(...)]
		 */
		subViews:null,
		/**
		 * boolean whether class is view
		 */
		isView: true,
		/**
		* Extensions of the view files
		*/
		viewExtension: "html",
		
		/**
		 * whether or not the template is to load asyncronously
		 */
		async:true,

		/**
		 * @private
		 * @param callback
		 */
		_init:function(callback){
			var me = this;
			if(me.autoRender){
				me.startLoader();
			}
			//get the view
			var a = Firebrick.utils.require(me._classname, function(tpl){
				//save the template
				me.tpl = tpl;
				callback.call();
			}, me.async, "html", me.viewExtension);
			if(!a.length){
				//nothing was loaded - ie. already loaded
				callback.call();
			}
			return this;
		},
		
		/**
		* Called on creation
		*/
		init: function(){
			var me = this;
			me.overrideReadyEvent = "base";
			me.on(me.overrideReadyEvent, function(){
				me._init(function(){
					//check the data of the view is in the correct format
					me.initStore();
					//parse html with data
					me.initView();
					
					me.fireEvent("ready");
				});
			});
			
			return me.callParent();
		},
		
		
		
		/**
		* Returns the store linked to the view
		*/
		getStore: function(){
			return this.store;
		},
		
		/**
		*	Returns data store data as object
		* @returns object
		*/
		getData: function(){
			return this.getStore().getData();
		},
		
		/**
		* Construct the view with template and data binding
		* @returns self
		*/
		initView: function(){
			var me = this;
			me.html = me.tpl;
			
			if(me.autoRender){
				me.render();
			}
			
			return me;
		},
		
		/**
		 * @private
		 */
		initSubViews: function(){
			return Firebrick.views.initSubViews(this);
		},
		
		/**
		* @returns jquery object
		*/
		getTarget: function(){
			return Firebrick.views.getTarget(this.target);
		},
		
		unbind:function(){
			var me = this,
				target = me.getTarget();
			if(target && target.attr("fb-view-bind")){
				var el = target[0];
				ko.cleanNode(el);
				target.removeAttr("fb-view-bind");
			}
		},
		
		bind: function(){
			var me = this,
			target = me.getTarget();
			if(target && !target.attr("fb-view-bind")){
				var el = target[0];
				Firebrick.views.renderTo(target, me.html);
				me.hide();
				me._state = "rendered";
				var data = me.getData();
				if(data && !$.isEmptyObject(data)){
					target.attr("fb-view-bind", me.getClassId());
					ko.applyBindings(data, el);
					me.setDisposeCallback(el);	
				}
				me.stopLoader();
				me.show();
				me.fireEvent("rendered", me);
			}
		},
		
		/**
		* Calls renderTo without parameters
		* @returns self
		*/
		render:function(){
			var me = this,
				target = me.getTarget();
			 
			if(target){
				
				me.unbind();
				
				me.bind();
				
				me.initSubViews();
				
			}else{
				console.warn("unable to render, no target found for", me.target, this);
			}
			
			return me;
		},
		
		setDisposeCallback: function(el){
			ko.utils.domNodeDisposal.addDisposeCallback(el, function(el){
				var view = Firebrick.getById($(el).attr("fb-view-bind"));
				view.unbound();
			});
		},
		
		/**
		 * @private
		 */
		unbound:function(){
			this._state = "unbound";
			this.fireEvent("unbound", this);
		},
		
		show: function(){
			var me = this,
				t = me.getTarget();
			if(t){
				t.show();
			}
		},
		
		hide: function(){
			var me = this,
				t = me.getTarget();
			if(t){
				t.hide();
			}
		},
		
		isVisible: function(){
			var me = this,
			t = me.getTarget();
			if(t){
				return t.is(":visible");
			}
			return false;
		},
		
		/**
		* Converts View data into a Store if not already done
		* @private
		* @param :: object :: Firebrick.view.Base object
		* @returns view
		*/
		initStore:function(){
			var me = this;
			me.store = me.store || {};
			if(!me.store.isStore){
				me.store = Firebrick.createStore({data:me.store});
			}
			return me;
		},
		
		/**
		* update the view with new dataa
		* @param data :: object :: extra data you wish to pass to the view
		* @returns self
		*/
		update:function(data){
			var me = this;
			me.getStore().setData(data);
			return me;
		},
		
		startLoader: function(){
			var me = this,
				t = me.getTarget();
			if(!me.loading && t){
				me.loading = true;
				Firebrick.delay(function(){
					//if still loading...
					if(me.loading){
						me.hide();
						t.before("<div id='fb-loader-" + me.getClassId() + "'>" + me.loadingTpl + "</div>");
					}
				}, 1);
				
			}
		},
		
		stopLoader: function(){
			var me = this;
			if(me.loading){
				$("#fb-loader-" + me.getClassId()).remove();
				me.show();
				me.loading = false;
			}
		}
		
	});
	
	Firebrick.define("Firebrick.controller.Base", {
		extend:"Firebrick.class.Base",
		
		/**
		* Called on creation
		*/
		init: function(){
			return this.callParent();
		},
		
		app:{
		
			/**
			* @see Firebrick.events.on()
			*/
			on: function(){
				return Firebrick.events.on.apply(Firebrick.events, arguments);
			},
			
			/**
			*	@see Firebrick.events.addListener
			*/
			listeners:function(){
				return Firebrick.events.addListener.apply(Firebrick.events, arguments);
			}
		},
		
	});
	
	Firebrick.define("Firebrick.store.Base", {
		extend:"Firebrick.class.Base",
		/**
		* Called on creation
		*/
		init: function(){
			var me = this;
			if(!me.dataInitialised){
				if(me.autoLoad){
					me.load();
				}else{
					if(me.data){
						me.setData(me.data);
					}	
				}
			}
			return this.callParent();
		},
		
		/**
		* Default store configurations
		* any types that jQuery allows in $.ajax()
		**/
		datatype: "json",
		/**
		* URL Config:
		* string :: only a get store - i.e. 1-way store, get information from the server
		* object :: mutliple directional store - get and send information to and from the server
		* @usage: url: "/getusers.php"
		* @usage: url: {
						get:"/getusers.php",
						submit: "/saveusers.php"
					}	
		*/
		url:{
			get:null,	//strings
			submit:null //strings 
		},
		
		/**
		* set the connection protocol, POST or GET for submit
		*/
		protocol: "POST",
		
		/**
		* Store status
		* @private
		* 1. initial :: store has just been created
		* 2. preload :: store is just about to fire the $.ajax event
		* 3. any :: success status of $.ajax()
		*/
		status:"initial",
		/**
		* Simple property to check whether this object is a store
		* @private
		*/
		isStore:true,
		/**
		* Whether the data in the store has been initialised, ie. convert to records etc.
		* @private
		**/
		dataInitialised: false,
		
		/**
		 * load store on creation
		 * default false
		 */
		autoLoad:false,
		/**
		 * data store - use setData()
		 * @private
		 */
		data: null,
		/**
		 * initial raw data that was passed when setting the store with setData() function
		 * @private
		 */
		_initialData:null,
		/**
		 * default value 
		 */
		async: true,
		/**
		 * used when calling getData()
		 */
		root: null,
		
		/**
		* Load the store
		* @usage load({
					callback:function(){},
					scope:this //scope for callback
				})
		* @param options :: object
		* @returns self
		*/
		load: function(options){
			return Firebrick.data.store.loadStore(this, options);
		},
		
		/**
		* Returns the store data attribute
		* @returns store data
		*/
		getData:function(){
			var me = this;
			if(me.root){
				if($.isPlainObject(me.data)){
					return $.isFunction(me.data[me.root]) ? me.data[me.root]() : me.data[me.root];
				}
			}
			return me.data;
		},
		
		/**
		 * provide the raw data
		 * @param initial :: optional :: boolean :: set to true if you want the original data passed to setData() - if left out or false - it will parse the ko-ed data back to a JS object
		 * @returns JS object
		 */
		getRawData: function(initial){
			var me = this;
			if(initial){
				return me._initialData;
			}
			var b = me.getData();
			b = $.isFunction(b) ? b() : b;
			return ko.toJS(b);
		},
		
		/**
		* Converts a json object into stores with records
		* @param data :: json object
		* @returns self
		*/
		setData: function(data){
			var me = this;
			
			if(!me.dataInitialised){
				if(!data.__ko_mapping__){
					me._initialData = data;
					data = ko.mapping.fromJS(data);
				}
				me.data = data;
				me.dataInitialised = true;
			}else{
				if(!data.__ko_mapping__){
					me._initialData = data;
					ko.mapping.fromJS(data, me.data);
				}else{
					console.error("cannot update store data using a mapped object", data);
				}
			}
			
			return me;
		},
		
		/**
		* Submit the store data to the specified url.submit path
		* @returns store
		*/
		submit: function(){
			return Firebrick.data.store.submit(this);
		},
		
		/**
		* convert store data to a plain object
		* @returns object
		*/
		toPlainObject: function(){
      var me = this;
			return $.isFunction(me.data) ? ko.toJS(me.data) : me.data;
		},
		
		/**
		* Convert store data to json string
		* @returns json string
		*/
		toJson: function(){
			return JSON.stringify(this.toPlainObject());
		}
		
		
	});
	
	//global
	window.Firebrick = Firebrick;
	window.fb = window.Firebrick;
}));