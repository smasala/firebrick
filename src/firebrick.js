/*!
* Firebrick JS - JavaScript MVC Framework powered by jQuery and Knockout JS
* @author Steven Masala [me@smasala.com]
* dependencies: jquery, knockout js
*/

(function (root, factory) {

    "use strict";

    if (typeof define === "function" && define.amd) {
        define(["jquery", "knockout", "knockout-mapping"], function ($, ko, kom) {
            ko.mapping = kom;
            return factory($, ko);
        });
    } else {
        factory(root.jQuery, root.ko);
    }

}(this, function ($, ko) {
    
    "use strict";
    
	if (window.Firebrick || window.fb) {
		console.error("unable to initialise FirebrickJS, window.Firebrick or window.fb are already defined");
		return;
	}

	/**
	 * A lightweight JavaScript MVC Framework powered with jQuery, Knockout JS and Require JS
	 * 
	 * @module Firebrick
	 * @class Firebrick
	 */
	var Firebrick = {
		
		/**
		 * @property version
		 * @type {String}
		 */
		version: "0.8.35",

		/**2
		* used to store configurations set Firebrick.ready()
		* @private
		* @property app
		* @type {Object}
		*/
		app: {
			name: "",
			path: ""
		},
		
		/** 
		 * ready function to kick start the application
		* @method ready
		* @param {Object} options
		* @param {Object} options.go {Function} - called on document ready
		* @param {Object} options.app
		* @param {Object} options.app.name name of the app
		* @param {Object} options.app.path path of the app
		* @param {Object} options.autoRender {Boolean} whether to call first view automatically  "{app.name}.view.Index",
		* @param {Object} options.viewData {Object} viewData to be passed to the autoRender view,
		* @param {Object} options.splash {String} - html or string to be rendered before the document is loaded - removed on document.ready
		* @param {Object} options.require {String, Array of Strings} file(s) are required
		* @param {Object} options.cache {Boolean} [cache=true] whether require should cache files or not,
		* @param {Object} options.dev {Boolean} [dev=false] true to print requirejs exceptions to console
		* @param {Object} options.lang language file name or store,
		*/
		ready: function (options) {
			var me = this;
			
            me.app = options.app;
			
			me.utils.initSplash(options.splash || me.templates.loadingTpl);

			Firebrick.boot.prepApplication(options);
			
			//if files need to be required first, then require them and fire the application
			if (options.require && options.require.length > 0) {
			
				if (!$.isArray(options.require)) {
					//convert to array if no already
					options.require = [options.require];
				}

				require(options.require, function () {
					me.utils.clearSplash();
					var args = arguments;
					$(document).ready(function () {
						options.go.apply(options.go, args);
					});
				});
			
			} else {
				me.utils.clearSplash();
				$(document).ready(function () {
					options.go();
				});
			}
		},
		
		/**
		 * @method shortcut
		 * @private
		 * @param scope {Object}
		 * @param func {String}
		 * @param args {Args..}
		 * @return {Many}
		 */
		shortcut: function (scope, func, args) {
			return scope[func].apply(scope, args);
		},
		
		/**
		 * shortcut for Firebrick.classes:get
		 * @method get
		 */
		get: function () {
			return this.shortcut(this.classes, "get", arguments);
		},
		/**
		 * shortcut for Firebrick.classes:getById
		 * @method getById
		 */
		getById: function () {
			return this.shortcut(this.classes, "getById", arguments);
		},
		/**
		 * shortcut for Firebrick.classes:create
		 * @method create
		 */
		create: function () {
			return this.shortcut(this.classes, "create", arguments);
		},
		/**
		 * shortcut for Firebrick.classes:define
		 * @method define
		 */
		define: function () {
			return this.shortcut(this.classes, "define", arguments);
		},
		/**
		 * shortcut for Firebrick.controllers.createController
		 * @method createController
		 */
		createController: function () {
			return this.shortcut(this.controllers, "createController", arguments);
		},
		/**
		 * shortcut for Firebrick.utils.require
		 * @method require
		 */
		require: function () {
			return this.shortcut(this.utils, "require", arguments);
		},
		/**
		 * shortcut for Firebrick.views.loadRaw
		 * @method loadRaw
		 */
		loadRaw: function () {
			return this.shortcut(this.views, "loadRaw", arguments);
		},
		/**
		 * shortcut for Firebrick.views.createView
		 * @method createView
		 */
		createView: function () {
			return this.shortcut(this.views, "createView", arguments);
		},
		/**
		 * shortcut for Firebrick.views.defineView
		 * @method defineView
		 */
		defineView: function () {
			return this.shortcut(this.views, "defineView", arguments);
		},
		/**
		 * shortcut for Firebrick.views.getBody
		 * @method getBody
		 */
		getBody: function () {
			return this.shortcut(this.views, "getBody", arguments);
		},
		/**
		 * shortcut for Firebrick.utils.delay
		 * @method delay
		 */
		delay: function () {
			return this.shortcut(this.utils, "delay", arguments);
		},
		/**
		 * shortcut for Firebrick.events.addListener
		 * @method addListener
		 */
		addListener: function () {
			return this.shortcut(this.events, "addListener", arguments);
		},
		/**
		 * shortcut for Firebrick.events.removeListener
		 * @method removeListener
		 */
		removeListener: function () {
			return this.shortcut(this.events, "removeListener", arguments);
		},
		/**
		 * shortcut for Firebrick.events.fireEvent
		 * @method fireEvent
		 */
		fireEvent: function () {
			return this.shortcut(this.events, "fireEvent", arguments);
		},
		/**
		 * shortcut for Firebrick.events.on
		 * @method on
		 */
		on: function () {
			return this.shortcut(this.events, "on", arguments);
		},
		/**
		 * shortcut for Firebrick.events.off
		 * @method off
		 */
		off: function () {
			return this.shortcut(this.events, "off", arguments);
		},
		/**
		 * shortcut for Firebrick.data.store.createStore
		 * @method createStore
		 */
		createStore: function () {
			return this.shortcut(this.data.store, "createStore", arguments);
		},
		/**
		 * shortcut for Firebrick.languages.getByKey
		 * @method text
		 */
		text: function () {
			return this.shortcut(this.languages, "getByKey", arguments);
		},
		/**
		 * @for Firebrick
		 * @class Classes
		 */
		classes: {
		
			/**
			* Class Registry
			* @property classRegistry
			* @private
			* @type {Object} map of all classes
			*/
			classRegistry: {},
			
			/**
			* returns a firebrick class by name from the registry
			* @method get
			* @param name {String}
			* @return {Object}
			*/
			get: function (name) {
				return this.classRegistry[name];
			},
			
			/**
			 * get a class by property: classId
			 * @method getById
			 * @param {String} id
			 * @return {Object}
			 */
			getById: function (id) {
				var me = this,
					clazz,
					k,v;
				
				for(k in me.classRegistry){
					if(me.classRegistry.hasOwnProperty(k)){
						v = me.classRegistry[k];
						if (v.getClassId && v.getClassId() === id) {
							clazz = v;
							//found class, stop iteration
							break;
						}
					}
				}
				
				return clazz;
			},
			
			/**
			 * remove a class from the registry 
			 * @method removeClass
			 * @param clazz {Object|String} clazz object or classname
			 */
			removeClass: function(clazz){
				delete Firebrick.classes.classRegistry[ (typeof clazz === "string" ? clazz : clazz._classname) ];	
			},
			
			/**
			 * @method _callParentConstructor
			 * @private
			 * @param func {Function}
			 * @param parent {Function}
			 * @return new function {Function}
			 */
			_callParentConstructor: function(func, parent){
				return function () {
					this.callParent = function () {
						return parent.apply(this, Firebrick.utils.stripArguments(arguments));
					};
                    var r = func.apply(this, arguments);
                    delete this.callParent;
                    return r;
                };
			},
			
			/**
			 * pass a simple object and a super class that you wish to extend from OOP
			 * @method extend
			 * @param {Object} obj
			 * @param {Object} superc object class
			 * @return {Object} prototype of superc (i.e. obj which extends from super
			 */
			extend: function (obj, superc) {
				var me = this,
					objTemp = {},
                    p;
				//iterate over all obj parameters
				for (p in obj) {
					if (obj.hasOwnProperty(p)) {
						//replace the property with a descriptor object
						objTemp[p] = Object.getOwnPropertyDescriptor(obj, p);
						//if the property is found in the super class and is a function
						if (superc[p] && $.isFunction(superc[p]) && $.isFunction(obj[p])) {
							//enable the function to call its super function by calling this.callParent
							objTemp[p].value = me._callParentConstructor(objTemp[p].value, superc[p]);
		               }
					}
                }
				//create a tmp version of the super object
		        var tmp = Object.create(superc);
		        //create a new object with the descriptors that inherit from super
		        return Object.create(Object.getPrototypeOf(tmp), objTemp);
			},
			
			/**
			* get or returns a firebrick class by name and calls init()
			* @method create
			* @param name {String}
			* @param config {Object}
			* @return {Object} class
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
			 * @method _initMixins
			 * @private
			 * @param clazz {Object}
			 * @param mix {Object} optional used by recursive
			 * @return {Object} clazz
			 */
			_initMixins: function(clazz){
				if(clazz.mixins){
					
					var mixit = function(obj, mix){
						if($.isPlainObject(mix)){
							if(!mix._mixedIn){
								mix._mixedIn = true;
								Firebrick.utils.overwrite(obj, mix);
							}
						}else if(typeof mix == "string"){
							if(!obj.hasMixin(mix)){
								obj.mixinAdded(mix);
								mix = Firebrick.create(mix);
								if(!mix){
									new Error("unable to find mixin", obj.mixins);
								}
								Firebrick.utils.overwrite(obj, mix);
							}
						}
						return mix;
					};
					
					if($.isArray(clazz.mixins)){
						for(var i = 0, l = clazz.mixins.length; i<l; i++){
							clazz.mixins[i] = mixit(clazz, clazz.mixins[i]);
						}
					}else{
						clazz.mixins = mixit(clazz, clazz.mixins);
					}
				}
				return clazz;
			},
			
			/**
			* define a firebrick class
			* @method define
			* @param name {String}
			* @param config {Object} optional
			* @return {Object} the newly created class
			*/
			define: function(name, config){
				var me = this,
					clazz;
			    
			    if(config.extend){
			        var _super = me.classRegistry[config.extend];
			        clazz = me.extend(config, _super);
			        clazz = me._initMixins(clazz);
			    }else{
			        clazz = Object.create(config);
			    }
			    
			    if(name){
			    	me.classRegistry[name] = clazz;
			    }
			    
			    if(clazz.constructor){
			    	clazz.constructor(name);
			    }
			    
			    return clazz;
			},
			
			/**
			 * overwrite a class with new properties - uses Firebrick.utils.overwrite
			 * @method overwrite
			 * @param name {String}
			 * @param properties {Object}
			 * @return Overwritten {Object}
			 */
			overwrite: function(name, properties){
				return Firebrick.utils.overwrite(Firebrick.get(name), properties);
			}
		},
		/**
		 * @for Firebrick
		 * @class Controllers
		 */
		controllers:{
			/**
			 * shorthand method. Same as calling Firebrick:create, however it sets the extend value on the config to "Firebrick.controller.Base" automatically
			 * @method createController
			 * @param name {String}
			 * @param config {Object} optional
			 * @return {Object} class
			 */
			createController: function(name, config){
				config = config || {};
				config.extend = "Firebrick.controller.Base";
				return Firebrick.create(name, config);
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Templates
		 */
		templates:{
			/**
			 * General loading tpl - override to change the loading mask
			 * Bootstrap is needed for this to work
			 * @property loadingTpl
			 */
			loadingTpl: "<div class='fb-view-loader'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></div>",
		},
		/**
		 * @for Firebrick
		 * @class Views
		 */
		views: {
			/**
			 * used by Firebrick.Boot:prepApplication to render the "view/Index.html" when autoRender is true
			 * @private
			 * @event viewReady
			 * @method bootView
			 * @param {Object} options
			 * @param {Object} options.viewData to pass to the view Store parameter
			 */
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
			* Create and render a view (shorthand function)
			* @method createView
			* @param name {String} example: "MyApp.view.MyView"
			* @param config {Object} (optional) object to config the View class with
			* @return {Object} Firebrick.view.Base class
			*/
			createView: function(name, config){
				if(name && !config){
					if($.isPlainObject(name)){
						//one parameter passed
						//createView({
						// ...
						//})
						config = name;
						name = null;
					}else{
						//createView("MyView")
						config = {};
					}
				}
				config = this.basicViewConfigurations(config);
				return Firebrick.create(name, config);
			},
			/**
			* Note: different to Firebrick.define() for classes -
			* Firebrick.defineView, defines and fetches if not already loaded the given view by name
			* @method defineView
			* @param name {String} name of the view to me shown "MyApp.view.MyView"
			* @param config {Object} (optional) object to config the View class with
			* @return {Object} Firebrick.view.Base class
			*/
			defineView: function(name, config){
				var me = this;
				config = me.basicViewConfigurations(config);
				return Firebrick.define(name, config);
			},
			/**
			 * initialise subviews of a view
			 * @private
			 * @method initSubViews
			 * @param view {Object}
			 * @return {Object} view passed
			 */
			initSubViews:function(view){
				var me = this,
					subViews = view.subViews;
				if(subViews){
					if($.isArray(subViews)){
						for(var i = 0, l = subViews.length; i<l; i++){
							view.subViews[i] = me.internal_loadSubView(subViews[i]);
						}
					}else{
						view.subViews = me.internal_loadSubView(subViews);
					}
				}
				
				return view;
			},
			
			/**
			 * used by initSubViews
			 * @private
			 * @method internal_loadSubView
			 * @param subView {Object}
			 * @return {Object} subView passed
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
			 * load a file as raw HTML - syncronous function
			 * @method loadRaw
			 * @param name {String} not standard path but Firebrick namespace path: "MyApp.views.MyView"
			 * @return {String} html
			 */
			loadRaw: function(name){
				var raw;
				Firebrick.utils.require(name, function(r){
					raw = r;
				}, false, "html", "html");
				return raw;
			},
			/**
			* Basic view configurations when defining/creating a view with shorthand function calls
			* @private
			* @method basicViewConfigurations
			* @param config {Object} (optional)
			* @return {Object}
			*/
			basicViewConfigurations: function(config){
				config = config || {};
				if(!config.extend){
					config.extend = "Firebrick.view.Base";
				}
				return config;
			},
			/**
			* jQuery body object (cache) - is set initally by {{crossLink Firebrick.views:getBody}}{{/crossLink}}
			* @private
			* @property _body
			* @type {Object} jquery object
			*/
			_body: null,
			/**
			* Shortcut to get jQuery("body")
			* @method getBody
			* @param refresh {Boolean} [default=false] (optional) if true gets the body object fresh from dom and not from cache
			* @return {Object} jquery object
			*/
			getBody: function(refresh){
				var me = this;
				if(refresh === true || !me._body){
					me._body = $("body");
				}
				return me._body;
			},
			/**
			* find the target using a selector - same as jQuery(selector)
			* @method getTarget
			* @param selector {String, jQuery Object}
			* @return {Object, Null} jquery object || null
			*/
			getTarget: function(selector){
				var a = selector && selector.jquery ? selector : $(selector);
				return a.length > 0 ? a : null;
			},
			/**
			* Render HTML or Template to the given target
			* @private
			* @method renderTo
			* @param target {jQuery Object}
			* @param html {String} template or html
			* @param append {Boolean} [default=false] if true will append to instead of overwriting content of target
			* @return {jQuery Object} target
			*/
			renderTo:function(target, html, append){
				if(append === true){
					return target.append(html);
				}
				return target.html(html);
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Boot
		 */
		boot:{
			/**
			 * used by Firebrick:ready
			 * @method prepApplication
			 * @private
			 * @param {Object} options
			 * @param {Object} options.cache
			 * @param {Object} options.dev
			 * @param {Object} options.lang
			 * @param {Object} options.autoRender
			 */
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
					    	console.error(err.text);
					    	console.error(err.requireMap);
					    	console.error(err.stack);
					    	new Error(err);
					    }

					};
				}
				
				if(options.lang){
					Firebrick.languages.init(options.lang);
				}
				
				if(options.autoRender !== false){
					Firebrick.views.bootView(options);
				}
				
			}
		},
		/**
		 * @for Firebrick
		 * @class Utils
		 */
		utils:{
			/**
			 * keep track of all require requests
			 * @property requiredFiles
			 * @private
			 * @type {Object} map
			 */
			requiredFiles:{},
			/**
			 * keep track of all the interval functions running
			 * @private
			 * @property intervalRegistry
			 * @type {Object} map
			 */
			intervalRegistry:{},
			/**
			 * used by init&Clear Splash
			 * @private
			 * @property splashCleared
			 * @type {Object} map
			 */
			splashCleared: false, 
			/**
			 * html is appended to the $("html") tag before the document is ready 
			 * used by Firebrick:ready
			 * @example 
					Firebrick.ready({
						splash:"<div></div>"
					});
			 * @method initSplash
			 * @private
			 * @param {String} html
			 */
			initSplash: function(html){
				var me = this;
				Firebrick.delay(function(){
					if(!me.splashCleared){
						$("html").append("<div id='fb-splash'>" + html + "</div>");
					}
				}, 1);
			},
			/**
			 * removes splash tag $("#fb-splash")
			 * @private
			 * @method clearSplash
			 */
			clearSplash: function(){
				this.splashCleared = true;
				$("#fb-splash").remove();
			},
			/**
			* overwrite properties in {obj1} with properties from {obj2} (mixin)
			* @method overwrite
			* @param obj1 {Object}
			* @param obj2 {Object}
			* @return {Object} obj1 mixed in with obj2
			*/
			overwrite: function(obj1, obj2){
				//iterate over all properties in obj2
				var k;
				for(k in obj2){
					//if(obj2.hasOwnProperty(k)){
					//include object proto properties
						obj1[k] = obj2[k];
					//}
				}
				
				return obj1;
			},
			/**
			 *  recursively iterate over prototypes and merge all the properties of an object together from its inherited parents for a specified property (name)
			 *  @private
			 *  @method merge
			 *  @param propName {String} name of property to merge
			 *  @param object {Object} object/class to iterate through
			 *  @param a {Object} (optional) used when calling itself recursively
			 *  @example 
			 *  		merge("a", {a:{a:"s"},__proto__:{a:{a:1, b:2, c:3}}})
			 *  		//returns {a:{a:"s", b:2, c:3},__proto__:{a:{a:1, b:2, c:3}}}
			 *  @return {Object} object : same object with property (name) merged
			 */
			merge:function(propName, object, a){
				var me = this,
					proto = Object.getPrototypeOf(a || object);
				
				if(proto.hasOwnProperty(propName)){
					
					var k,v, p = proto[propName];
					
					for(k in p){
						if(p.hasOwnProperty(k)){
							v = p[k];
							if(!(k in object[propName])){
								object[propName][k] = v;
							}
						}
					}
					
					//mixin deeper (recursive)
					me.merge(propName, object, proto);
				}
				
				return object;
			},
			
			/**
			*	Javascript setTimout function
			* @example
			* 	delay(function(){}, 1000, scope);
			* @method delay
			* @param callback {Function}
			* @param timeout {Integer} miliseconds
			* @param args {any} pass to delay function
			* @param scope {Object} (optional) scope of the callback function. Defaults to: window
			*/
			delay: function(callback, timeout, args, scope){
				window.setTimeout(function(args1){
					callback.apply(scope || this, args1);
				}, timeout, args);
			},
			/**
			 * clear the interval running by id
			 * @method clearInterval
			 * @param id {String}
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
			 * @method setInterval
			 * @param id {String} (optional)
			 * @param callback {Function}
			 * @param timeout {Integer} miliseconds
			 * @param scope {Object} scope to apply to the callback
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
			 * use Firebrick.utils:setInterval()
			 * @method int_applyInterval
			 * @private 
			 * @param id {String} (optional)
			 * @param callback {Function}
			 * @param interval {Interger}
			 * @param scope {Object}
			 * @return id {String}
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
			 * @method isIntervalRunning
			 * @param id {String}
			 * @return {Object} interval function
			 */
			isIntervalRunning: function(id){
				return this.intervalRegistry[id];
			},
			
			/**
			 * 
			 * @use 
			 * 		var a = function(){
			 * 			//arguments are [["a"]]
			 * 			return stripArguments(arguments) //return ["a"]
			 * 		}
			 * 		var b = function(){
			 * 			return a(arguments); //note not called with apply
			 * 		}
			 *		b("a")
			 * used to strip the an arguments "array" inside an wrapper "array" - http://jsfiddle.net/smasala/ppdtLmag/
			 * @method stripArguments
			 * @param args {Object}
			 * @return {Object}
			 */
			stripArguments:function(args){
				if ($.isPlainObject(args) && $.isNumeric(args.length) && args.hasOwnProperty("callee")) {
					//convert the arguments array back to a simple array
					if (args.length) {
						args = args[0];
					}
				}
				return args;
			},
			
			/**
			* Get a script/file from path
			* @example 
			* 	require("MyApp.controller.MyController", function(){}, true, "html", "js");
			* @method require
			* @param name {String, Array of Strings} MyApp.controller.MyController
			* @param callback {Function} (optional) called when last require has completed or failed
			* @param async {Boolean} [default=true]
			* @param data_type {String} [default='script'] jQuery ajax datatype
			* @param ext {String} [defaults='js'] file extension.
			* @return {Array of Strings} the files that were eventually loaded
			*/
			require: function(names, callback, async, data_type, ext){
				var me = this, 
					path,
					callbackResponse = {};
					
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
					newCallback = function(){	//prepare callback function
						ajaxCounter--;
						if(ajaxCounter === 0){
							if(callback && $.isFunction(callback)){
								callback.apply(this, arguments);
							}
						}
					};
				
		        //iterate of each file and get them
					
				var name;
				for(var i = 0, l = names.length; i<l; i++){
					name = names[i];
					//convert the name into the correct path
					me.requiredFiles[name] = true;
					path = me.getPathFromName(name, ext);
					$.ajax({
						async:$.type(async) == "boolean" ? async : true,
						dataType:data_type,
						url:path,
						success:function(){
							if(names.length > 1){
								callbackResponse[name] = arguments;
								newCallback.call(this, callbackResponse);
								
							}else{
								newCallback.apply(this, arguments);
							}
						},
						error:function(reponse, error, errorMessage){
							console.warn("unable to load file/class '", name, "' at:", path);
							console.error(error, errorMessage);
							newCallback.apply(this, arguments);
						}
					});
				}
					
				return names;
			},
			/**
			* Converts a name like "MyApp.controller.MyController" to a path MyApp/controller/MyController
			* @private
			* @method getPathFromName
			* @param name {String}
			* @param ext {String} [default='js']
			* @return {String}
			*/
			getPathFromName: function(name, ext){
				var homePath = Firebrick.app.path,
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
			* @property _globalC
			* @private
			*/
			_globalC: 1,
			/**
			 * returns a unique id: http://stackoverflow.com/a/19223188
			 * @method uniqId
			 * @return {String} unique id
			 */
			uniqId: function() {
				var me = this,
					d = new Date(),
					m = d.getMilliseconds() + "",
					u = ++d + m + (++me._globalC === 10000 ? (me._globalC = 1) : me._globalC);

				return u;
			},
			/**
			 * load css file and append to HEAD
			 * @method loadCSS
			 * @param {String} url
			 */
			loadCSS: function(url) {
			    var link = document.createElement("link");
			    link.type = "text/css";
			    link.rel = "stylesheet";
			    link.href = url;
			    document.getElementsByTagName("head")[0].appendChild(link);
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Languages
		 */
		languages:{
			/**
			 * use get/setLang() to change the language
			 * @property lang
			 * @private
			 * @type {ko.observable}
			 * @default ko.observable("en")
			 */
			lang: ko.observable("en"),
			/**
			 * store of keys ko.observale
			 * @private
			 * @property keys
			 * @type {ko.observable}
			 * @default ko.observable({})
			 */
			keys:ko.observable({}),
			/**
			 * initial the language keys
			 * @example
			 * 	Firebrick.ready({lang:...}) //to set language
			 * @private
			 * @method
			 * @param lang {String, Store} string = url to load
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
			 * @method getByKey
			 * @param key {String}
			 * @return {String}
			 */
			getByKey: function(key){
				key = $.isFunction(key) ? key() : key;
				var me = this,
					keyLower = key.toLowerCase(),
					a = me.keys()[me.lang()];
				return a && a[keyLower] ? a[keyLower] : key;
			},
			/**
			 * set the app language
			 * @method setLang
			 * @param langKey {String}
			 */
			setLang: function(langKey){
				this.lang(langKey);
			},
			/**
			 * get Lang as string
			 * @method getLang
			 * @return {String}
			 */
			getLang: function(){
				return this.lang();
			},
			/**
			 * available langages
			 * @method allLanguages
			 * @return {Array of Strings} all possible languages
			 */
			allLanguages: function(){
				var me = this,
					langs = [],
					data = ko.mapping.toJS(me.keys),
					l;
				
				for(l in data){
					if(data.hasOwnProperty(l)){
						langs.push(l);
					}
				}
				
				return langs;
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Events
		 */
		events: {
			/**
			* Event registry
			* @private
			* @property eventRegistry
			* @type {Object} map
			*/
			eventRegistry: {},
			/**
			* Event Counter - used to make callbacks by id
			* @method eventCounter
			* @type {Integer}
			* @private
			*/
			eventCounter: 0,
			/**
			* add a listener to a specific event by name
			* @example 
			* 		addListener("myEvent", myFunction(){}, this);
			* @example
			* 		addListener({
						"myEvent": function(){},
						"mySecondEvent": function(){},
						scope: this
					})
			* @method addListener
			* @param eventName {String, Object}
			* @param callback {Function}
			* @param scope {Object} (optional) scope in which the listener is fired in
			* @return {Function} the function with the assigned callbackId;
			*/
			addListener: function(eventName, callback, scope){
				var me = this;
				
				if($.isPlainObject(eventName)){
					return me.addListener_internal(eventName);
				}
				
				if(!callback.conf){
					callback.conf = {};
					callback.conf.callbackId = me.eventCounter++;
				}else{
					//already registered
					return callback;
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
			* Use Firebrick.events:addListeners
			* @private
			* @method addListener_internal
			* @example
			* 	 addListeners_internal({
					"myEvent": function(){},
					"mySecondEvent": function(){},
					scope: this
				})
			* @param {Object} object
			*/
			addListener_internal: function(object){
				var me = this, 
					scope = object.scope,
					eventName;
				
				delete object.scope;
				
				for(eventName in object){
					if(object.hasOwnProperty(eventName)){
						me.addListener(eventName, object[eventName], scope);
					}
				}
				
			},
			/**
			* remove listener by eventName and function
			* @example
			* 		removeListener("myEvent", function);
			* @method removeListener
			* @param eventName {String}
			* @param funct {Function} (optional) if non given will remove all listeners for event
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
			* @example 
			* 		fireEvent("eventFired", 1, "test", false);
			* @method fireEvent
			* @param eventName {String}
			* @param arguments {Any...} arguments passed to event when fired
			*/
			fireEvent: function(eventName){
				var me = this, reg = me.eventRegistry[eventName];
				if(reg){
					//get the argument from this function call
					var args = Array.slice(arguments),
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
			* @method createEventData
			* @private
			* @param eventName {String}
			* @return {Object} event object
			*/
			createEventData: function(eventName){
				var me = this, ev = {
					event: eventName, 
					conf: null,
					/**
					* removes the listener it called from within
					* @example
					* @method removeSelf
					* 		event.removeSelf();
					*/
					removeSelf: function(){
						me.removeListener(eventName, ev.funct);
					}
				};
				
				return ev;
			},
			/**
			* Define events and their callbacks, similar to $(selector).on(eventname, callback)
			* @example
			* 		on("click", "a.mylink", function(){}, newScope)
			* @example 
			* 		on({
						"a.link":{
							click:function(){},
							mouseover:function(){}
						},
						scope:this
					})
			* @method on
			* @param eventName {String, Object} string =  same as jquery selector(s)
			* @param selector {String} (optional) use if first arg is not an object
			* @param callback {Function} (optional) use if first arg is not an object
			* @param scope {Object} (optional) change scope on callback function use if first arg is not an object
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
			* @example
			* 		off( "click", "#theone", function(){} )
			* @method
			* @param selector {String}
			* @param eventName {String}
			* @param callback {Function} the function used in on()
			*/
			off: function(eventName, selector, callback){
				$(document.body).off(eventName, selector, callback);
			},
			/**
			* use Firebrick.events:on
			* @example 
			* 		on_internal({
							"a.link":{
								click:function(){},
								mouseover:function(){}
							},
							scope:this
						}
			* @method on_internal
			* @param {Object} object
			* @private
			*/
			on_internal: function(object){
				var me = this, 
					scope = object.scope, 
					selector, 
					eventName,
					events;
				
				delete object.scope;
				
				for(selector in object){
					if(object.hasOwnProperty(selector)){
						events = object[selector];
						for(eventName in events){
							if(events.hasOwnProperty(eventName)){
								me.register_on_event(eventName, selector, events[eventName], scope);
							}
						}
					}
				}
				
			},
			/**
			* use Firebrick.events:on
			* @method register_on_event
			* @private
			*/
			register_on_event: function(eventName, selector, callback, scope){
				$(document).on(eventName, selector, function(){
					//add scope as last argument, just in case the scope of the function is changed
					var args = Array.slice(arguments);
					args.push(this);
					callback.apply(scope || this, args);
				});
			}
			
		},
		/**
		 * @for Firebrick
		 * @class Data
		 */
		data: {
			/**
			 * @for Data
			 * @namespace Data
			 * @class Store
			 */
			store: {
				/**
				* creates a new Firebrick.store.Base store to be used OR if a name and config are supplied, then Firebrick.create() is called
				* @example
				* 		//creates a new class Firebrick.store.Base to be used
				* 		createStore({
							data:{name:"bob"}
						}); 
				* @example 
				* 		createStore("MyApp.store.MyStore", {}); //Firebrick.create() is called
				* @example 
				* 		createStore() //returns a Store class to be used
				* @method createStore
				* @param name {String} if string, then Firebrick:create is called
				* @param config {Object} data to config the class with - called in conjuction when name is set
				* @return {Object} Firebrick.store.Base
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
				* @method basicStoreConfigurations
				* @param config {Object} (optional)
				* @return {Object}
				*/
				basicStoreConfigurations: function(config){
					config = config || {};
					if(!config.extend){
						config.extend = "Firebrick.store.Base";
					}
					return config;
				},
				/**
				* Used by Firebrick.store.Base:load
				* @private
				* @method loadStore
				* @param store {Object} Firebrick.store.Base object
				* @param {Object} options 
				* @param {Boolean} options.async [default=store.async] 
				* @param {Function} options.callback [store, jsonObject, status, response]
				* @param {Object} options.scope
				* @return {Object} store
				*/
				loadStore: function(store, options){
					options = options || {};
					var url = store.url,       
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
				* @method submit
				* @param store {Object} //Firebricks.store.Base class
				* @param callback {Function} (optional) function to call on store submission success
				* @return {Object} store
				*/
				submit: function(store, callback){
					var data;
					
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
							success: function(data, status){
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
		/**
		 * @for Firebrick
		 * @class Router
		 */
		router:{
			/**
			 * set route definitions
			 * @example
			 * 		Firebrick.router.set({
			 * 			"users/abc": function(){},
			 * 			"contact": function(){}
			 * 		})
			 * @example
			 * 		Firebrick.router.set(function(){}) //call function regardless of route
			 * @method set
			 * @param config {Object}
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
							var hash;
							for(hash in config){
								if(config.hasOwnPropery(hash)){
									if(Firebrick.router.is("#" + hash)){
										config[hash].apply(this, arguments);
										break;
									}
								}
							}
						};
					}
				}
					
					
				return me.onHashChange(route);
			},
			/**
			* Call a function when the hash changes on the site
			* use Firebrick.route:set
			* @example
					Firebrick.router.onHashChange(function(){
						//something happens
					})
			* @private
			* @method onHashChange
			* @param callback {Function}
			* @return {Object} jQuery object
			*/
			onHashChange: function(callback){
				return $(window).on("hashchange", function(){
					callback.apply(this, arguments);
				});
			},
			/**
			* Check whether the pattern or hash is present
			* @example
			* 	Firebrick.router.is("#/completed") // returns true or false
			* @method is
			* @param pattern {String}
			* @return {Boolean}
			*/
			is: function(pattern){
				if(pattern.indexOf("#") !== -1){
					return window.location.hash == pattern;
				}
				
				return window.location.href.replace(window.location.origin) == pattern;
			}
		
		}
		
	};
	
	/**
	 * @class class.Base
	 * @module Firebrick.class
	 */
	Firebrick.define("Firebrick.class.Base", {
		/**
		 * unlike init, this is called when defining a class
		 * @method constructor
		 * @param {String} name - class name
		 * @return {Object} self
		 */
		constructor: function(name){
			var me = this;
			if(name){
				me._classname = name;
			}
			return me;
		},
		/**
		 * create a copy of the listener for each class
		 * @private
		 * @method _cloneListener
		 * @param {Function} function
		 * @return {Function}
		 */
		_cloneListener: function(func){
			return function(){
				var r = func.apply(this, arguments);
				return r;
			};
		},
		/**
		 * @method init
		 * @return self
		 */
		init:function(){
			//inits of all inits :)
			var me = this,
				k,v;
			if(me.listeners){
				Firebrick.utils.merge("listeners", me);
				for(k in me.listeners){
					if(me.listeners.hasOwnProperty(k)){
						v = me.listeners[k];
						if($.isFunction(v)){
							//create a copy of the function - otherwise the all mixins point to the same function
							me.listeners[k] = me._cloneListener(v);
						}
					}
				}
				me.on(me.listeners);
			}
			me.fireEvent(me.overrideReadyEvent || "ready");
			return me;
		},
		/**
		 * @property mixins
		 * @type {String|Object|[String]}
		 * @default null
		 */
		mixins:null,
		/**
		 * reference for mixins that have been mixed in.
		 * works only if "mixins" is a String or array or strings
		 * @property mixedIn
		 * @private
		 * @type {Object}
		 * @default: null
		 */
		_mixins:null,
		/**
		 * @method mixinAdded
		 * @param name {String}
		 * @return self {Object}
		 */
		mixinAdded: function(name){
			var me = this;
			if(!me._mixins){
				me._mixins = {};
			}
			me._mixins[name] = 1;
			return me;
		},
		/**
		 * @method hasMixin
		 * @param name {String}
		 * @return {Boolean}
		 */
		hasMixin: function(name){
			var me = this;
			return !(!me._mixins || !me._mixins[name]);
		},
		/**
		 * @private
		 * @property _idPrefix
		 * @type {String}
		 */
		_idPrefix: "fb-",
		/**
		 * use Firebrick.class.Base:getClassId
		 * @private 
		 * @property _classId
		 * @type {String}
		 */
		_classId:null,
		/**
		 * event registry
		 * @private
		 * @property localEventRegistry
		 * @type {Object} map
		 */
		localEventRegistry: null,
		/**
		 * get the id for the current class
		 * @method getClassId
		 * @return {String}
		 */
		getClassId: function(){
			var me = this;
			if(!me._classId){
				//generate an id if it doesnt have one already
				me._classId = me._idPrefix + Firebrick.utils.uniqId();
			}
			return me._classId;
		},
		/**
		 * shorthand for defining class listeners so you don't have to create the init function and use this.on()
		 * @example
		 * 		 listeners:{
		 * 				"ready": function(){},
		 * 				scope:this
		 * 			}
		 * @property listeners
		 * @type {Object} map
		 */
		listeners:null,
		/**
		* register a listener to this object, when the object fires a specific event
		* @example 
		* 	on("someEvent", callback)
		* @example 
		* 	on({
		*     "someevent": callback,
		*     "someotherevent": callback1
		* 	})
		* @method on
		* @param eventName {String}
		* @param callback {Function}
		* @param scope {Object} (optional)
		* @return {Object} self
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
				var s = eventName.scope || me,
					k;
				
				delete eventName.scope;
				
				for(k in eventName){
					if(eventName.hasOwnProperty(k)){
						addEvent(k, eventName[k], s);
					}
				}
				
			}else{
				//just add the event
				scope = scope || me;
				addEvent(eventName, callback, scope);
			}
			
			return me;
		},
		/**
		* remove a listener that was registered with .on()
		* @method off
		* @param eventName {String}
		* @param callback {Function} the function that was used when registering the event with .on()
		* @return {Object}
		*/
		off: function(eventName, callback){
			var me = this,
				func;
			if(me.localEventRegistry && me.localEventRegistry[eventName]){
				
				for(var i = 0, l = me.localEventRegistry[eventName].length; i<l ; i++){
					func = me.localEventRegistry[eventName][i];
					if(func.id == callback.id){
						//delete listeners from array
						me.localEventRegistry[eventName].splice(i, 1);
						break;
					}
				}
				
			}
			return me;
		},
		/**
		* Fire an event on this object
		* @method fireEvent
		* @param eventName {String} name of the event to fire
		* @param args {Any...} (optional)
		* @return {Object} self
		*/
		fireEvent: function(){
			var me = this,
				events = me.localEventRegistry,
				args = arguments, 
				eventName = arguments[0];	//get first argument - i.e. the event name
			if(events && events[eventName]){
				
				var func, eObj = events[eventName];
				for(var i = 0, l = eObj.length; i < l; i++){
					func = eObj[i];
					func.apply(func.scope || func, args);
				}
				
			}
			return me;
		},
		/**
		 * pass an event to another object - fire the same event on the second object with all the arguments of the first
		 * @method passEvent
		 * @param argument :: arguments array
		 * @example
		 * 		 	classOne.on("someEvent", function(){
		 * 				//fire the same event on the second object with all the arguments of the first
		 *		 		classTwo.passEvent(arguments);	//same as classTwo.fireEvent("someEvent", arg1, arg2, arg3, ...)
		 * 			});
		 * @return {Any} value from fireEvent
		 */
		passEvent: function(){
			return this.fireEvent.apply(this, Firebrick.utils.stripArguments(arguments));
		},
	});
	
	/**
	 * Extends {{#crossLink Firebrick.class.Base}}{{/crossLink}}
	 * @extends class.Base
	 * @class view.Base
	 */
	Firebrick.define("Firebrick.view.Base", {
		extend:"Firebrick.class.Base",
		/**
		* set when the view is loaded by the ajax request
		* @property tpl
		* @type {String} 
		* @default ""
		*/
		tpl: "",
		/**
		 * bind a store or plain data to the view
		 * @property store
		 * @type {String|Store Object}
		 * @default null
		 */
		store:null,
		/**
		* parsed html using the tpl and data
		* @property html
		* @type {String} html
		* @default ""
		*/
		html:"",
		/**
		* Target to which to render the html content
		* @property target
		* @type {String|Object} jquery selector || jquery object
		* @default null
		*/
		target:null,
		/**
		* render the view on class creation
		* @property autoRender
		* @type {Boolean}
		* @default true
		*/
		autoRender:true,
		/**
		* controller to bind to the view
		* @property controller
		* @type {String|Object} name of the controller || controller class itself
		* @default null
		*/
		controller: null,
		/**
		 * loading template - loaded into target is showLoading == true
		 * @property loadingTpl
		 * @type {String}
		 * @default Firebrick.templates:loadingTpl
		 */
		loadingTpl: Firebrick.templates.loadingTpl,
		/**
		 * whether the loader is being shown or not
		 * @private
		 * @property loading
		 * @type {Boolean}
		 * @default false
		 */
		loading: false,
		/**
		 * whether to show that the view is loading
		 * @property showLoading
		 * @type {Boolean}
		 * @default true
		 */
		showLoading: true,
		/**
		* State the view is current in. "initial", "rendered"
		* @property _state
		* @type {String}
		* @private
		* @default "initial"
		*/
		_state:"initial",
		/**
		 * define subviews to load after creation of this view
		 * @example 
		 * 		subViews: MyApp.view.MyView
		 * @example 
		 * 		subViews: ["MyApp.view.MyView", "MyApp.view.MyView1"]
		 * @example 
 		 *		subViews: Firebrick.defineView(...)
		 * @example 
		 * 		subViews: [Firebrick.defineView(...), Firebrick.defineView(...)]
		 * @property subViews
		 * @type {String|Array of Strings|Object|Array of Objects}
		 */
		subViews:null,
		/**
		 * boolean whether class is view
		 * @property isView
		 * @private
		 * @type {Boolean}
		 */
		isView: true,
		/**
		* Extensions of the view files
		* @property viewExtension
		* @type {String}
		* @default "html"
		*/
		viewExtension: "html",
		/**
		 * whether or not the template is to load asyncronously
		 * @property async
		 * @type {Boolean}
		 * @default true
		 */
		async:true,
		/**
		 * whether to append or overwrite the content of the target
		 * @property appendContent
		 * @type {Boolean}
		 * @default false
		 */
		appendContent:false,
		/**
		 * @private
		 * @method _init
		 * @param callback {Function}
		 */
		_init:function(callback){
			var me = this;
			if(me.autoRender){
				me.startLoader();
			}
			
			//get the view
			if(!me.tpl){
				var a = Firebrick.utils.require(me._classname, function(tpl){
					//save the template
					me.tpl = tpl;
					callback.call();
				}, me.async, "html", me.viewExtension);
				if(!a.length){
					//nothing was loaded - ie. already loaded
					callback.call();
				}
			}else{
				if($.isFunction(me.tpl)){
					me.tpl = me.tpl();
				}
				callback.call();
			}
			
			return this;
		},
		
		/**
		* Called on creation
		* @method init
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
			
			return me.callParent(arguments);
		},
		/**
		* Returns the store linked to the view
		* @method getStore
		*/
		getStore: function(){
			return this.store;
		},
		/**
		*	Returns data store data as object
		* @method getData
		* @return {Object}
		*/
		getData: function(){
			return this.getStore().getData();
		},
		/**
		* Construct the view with template and data binding
		* @method initView
		* @return {Object} self
		*/
		initView: function(){
			var me = this;
			me.html = me.tpl;
			
			if(me.autoRender && me.getTarget()){
				me.render();
			}
			
			return me;
		},
		/**
		 * @private
		 * @method initSubViews
		 */
		initSubViews: function(){
			return Firebrick.views.initSubViews(this);
		},
		/**
		 * @method getTarget
		* @return {Object} jquery object
		*/
		getTarget: function(){
			return Firebrick.views.getTarget(this.target);
		},
		/**
		 * Called by view.Base:render()
		 * @method unbind
		 */
		unbind:function(){
			var me = this,
				target = me.getTarget();
			if(target && target.attr("fb-view-bind")){
				var el = target[0];
				ko.cleanNode(el);
				target.removeAttr("fb-view-bind");
			}
		},
		/**
		 * Called by view.Base:render()
		 * @method bind
		 */
		bind: function(){
			var me = this,
			target = me.getTarget();
			if(target && !target.attr("fb-view-bind")){
				var el = target[0];
				Firebrick.views.renderTo(target, me.html, me.appendContent);
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
		* @method render
		* @return {Object} self
		*/
		render:function(){
			var me = this,
				target = me.getTarget();
			 
			if(target){
				
				me.fireEvent("beforeRender", me);
				
				me.unbind();
				
				me.bind();
				
				me.initSubViews();
				
			}else{
				console.warn("unable to render, no target found for", me.target, this);
			}
			
			return me;
		},
		/**
		 * @method setDisposeCallback
		 * @param el {HTMLElement}
		 */
		setDisposeCallback: function(el){
			ko.utils.domNodeDisposal.addDisposeCallback(el, function(el){
				var view = Firebrick.getById($(el).attr("fb-view-bind"));
				view.unbound();
			});
		},
		/**
		 * called by view.Base:setDisposeCallback
		 * @private
		 * @method unbound
		 */
		unbound:function(){
			var me = this,
				store = me.getStore();
			me._state = "unbound";
			if(store){
				store.fireEvent("unbound", me);
				me.store = null;
			}
			me.fireEvent("unbound", me);
		},
		/**
		 * show target view.Base:getTarget
		 * @method show
		 */
		show: function(){
			var me = this,
				t = me.getTarget();
			if(t){
				t.show();
			}
		},
		/**
		 * hide target view.Base:getTarget
		 * @method hide
		 */
		hide: function(){
			var me = this,
				t = me.getTarget();
			if(t){
				t.hide();
			}
		},
		/**
		 * @method isVisible
		 */
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
		* @method initStore
		* @param {Object} Firebrick.view.Base object
		* @return {Object} self
		*/
		initStore:function(){
			var me = this;
			me.store = me.store;
			if(me.store && !me.store.isStore){
				me.store = Firebrick.createStore({data:me.store});
			}
			return me;
		},
		/**
		* update the view with new data
		* @method update
		* @param data {Object} extra data you wish to pass to the view
		* @return {Object} self
		*/
		update:function(data){
			var me = this;
			me.getStore().setData(data);
			return me;
		},
		/**
		 * @method startLoader
		 * @private
		 */
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
		/**
		 * @method stopLoader
		 * @private
		 */
		stopLoader: function(){
			var me = this;
			if(me.loading){
				$("#fb-loader-" + me.getClassId()).remove();
				me.show();
				me.loading = false;
			}
		}
		
	});
	/**
	 * Extends {{#crossLink Firebrick.class.Base}}{{/crossLink}}
	 * @extends class.Base
	 * @class controller.Base
	 */
	Firebrick.define("Firebrick.controller.Base", {
		extend:"Firebrick.class.Base",
		/**
		* Called on creation
		* @method init
		*/
		init: function(){
			return this.callParent(arguments);
		},
		/**
		 * @property app
		 * @type {Object}
		 * @example
		 * 		controller.app.on(...)
		 * 		controller.app.listeners(...)
		 */
		app:{
		
			/**
			 * see Firebrick.events:on
			* @property on
			* @type {Function} 
			*/
			on: function(){
				return Firebrick.events.on.apply(Firebrick.events, arguments);
			},
			
			/**
			 * see Firebrick.events:addListener
			* @property listeners
			* @type {Function} 
			*/
			listeners:function(){
				return Firebrick.events.addListener.apply(Firebrick.events, arguments);
			}
		},
		
	});
	/**
	 * Extends {{#crossLink Firebrick.class.Base}}{{/crossLink}}
	 * @extends class.Base
	 * @class store.Base
	 */
	Firebrick.define("Firebrick.store.Base", {
		extend:"Firebrick.class.Base",
		/**
		* Called on creation
		* @method init
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
			if(me.autoDestroy){
				me.on("unbound", function(){
					me.data = null;
					me.status = "destroyed";
					Firebrick.classes.removeClass(me);
				});
			}
			return this.callParent(arguments);
		},
		/**
		* Default store configurations
		* any types that jQuery allows in $.ajax()
		* @property datatype
		* @type {String}
		* @default "json"
		*/
		datatype: "json",
		/**
		* URL Config:
		* @property url
		* @type {String, Object} string :: only a get store - i.e. 1-way store, get information from the server. object :: mutliple directional store - get and send information to and from the server
		* @example
		* 	 url: "/getusers.php"
		* @example
		* 		 url: {
						get:"/getusers.php",
						submit: "/saveusers.php"
					}	
		*/
		url:{
			/**
			 * @property get
			 * @type {String}
			 * @default null
			 */
			get:null,	//strings
			/**
			 * @property submit
			 * @type {String}
			 * @default null
			 */
			submit:null //strings 
		},
		/**
		* set the connection protocol, POST or GET for submit
		* @property protocol
		* @type {String}
		* @default "POST"
		*/
		protocol: "POST",
		/**
		* Store status
		* 1. initial :: store has just been created
		* 2. preload :: store is just about to fire the $.ajax event
		* 3. any :: success status of $.ajax()
		* @private
		* @property status
		* @type {String}
		*/
		status:"initial",
		/**
		* Simple property to check whether this object is a store
		* @private
		* @property isStore
		* @type {Boolean}
		* @default true
		*/
		isStore:true,
		/**
		* Whether the data in the store has been initialised, ie. convert to records etc.
		* @private
		* @property dataInitialised
		* @type {Boolean}
		* @default false
		*/
		dataInitialised: false,
		/**
		 * load store on creation
		 * @property autoLoad
		 * @type {Boolean}
		 * @default false
		 */
		autoLoad:false,
		/**
		 * data store - use setData()
		 * @private
		 * @property data
		 * @type {Object}
		 * @default null
		 */
		data: null,
		/**
		 * initial raw data that was passed when setting the store with setData() function
		 * @private
		 * @property _initialData
		 * @type {Object}
		 * @default null
		 */
		_initialData:null,
		/**
		 * default value
		 * @property async
		 * @type {Boolean}
		 * @default true
		 */
		async: true,
		/**
		 * specify a root - used when calling getData()
		 * @property root
		 * @type {String}
		 * @default null
		 */
		root: null,
		/**
		 * @property autoDestroy
		 * @type {Boolean}
		 * @default true
		 */
		autoDestroy:true,
		/**
		* Load the store - see data.store:loadStore
		* @example 
		* 		load({
					callback:function(){},
					scope:this //scope for callback
				})
		* @method load
		* @param options {Object}
		* @return {Object} self
		*/
		load: function(options){
			return Firebrick.data.store.loadStore(this, options);
		},
		/**
		* Returns the store data attribute
		* @method getData
		* @return {Object} store data
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
		 * @method getRawData
		 * @param initial {Boolean} [default=false] (optional) set to true if you want the original data passed to setData() - if left out or false - it will parse the ko-ed data back to a JS object
		 * @return {Object}
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
		* @method setData
		* @param data {Object}
		* @return {Object} self
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
		* see data.store:submit
		* @method submit
		* @return {Object} self
		*/
		submit: function(){
			return Firebrick.data.store.submit(this);
		},
		/**
		* convert store data to a plain object
		* @method toPlainObject
		* @return {Object}
		*/
		toPlainObject: function(){
			var me = this;
			return $.isFunction(me.data) ? ko.toJS(me.data) : me.data;
		},
		/**
		* Convert store data to json string
		* @method toJson
		* @return {String} json
		*/
		toJson: function(){
			return JSON.stringify(this.toPlainObject());
		}
		
	});
	/**
	 * @class window
	 * @module Global
	 */

	/**
	 * 
	 * @property Firebrick 
	 * @type {Object}
	 */
	window.Firebrick = Firebrick;
	
	/**
	 * @property fb 
	 * @type {Object}
	 */
	window.fb = window.Firebrick;
	
	return Firebrick;
}));