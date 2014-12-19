/*!
* Firebrick JS - JavaScript MVC Framework powered by jQuery and Knockout JS
* @author Steven Masala [me@smasala.com]
* dependencies: jquery, knockout js
*/

(function(e,t){typeof define=="function"&&define.amd?define(["jquery","knockout","knockout-mapping"],function(e,n,r){return n.mapping=r,t(e,n)}):t(e.jQuery,e.ko)})(this,function(e,t){if(window.Firebrick||window.fb){console.error("unable to initialise FirebrickJS, window.Firebrick or window.fb are already defined");return}var n={version:"0.8.47",app:{name:"",path:""},ready:function(t){var r=this;r.app=t.app,r.utils.initSplash(t.splash||r.templates.loadingTpl),n.boot.prepApplication(t),t.require&&t.require.length>0?(e.isArray(t.require)||(t.require=[t.require]),require(t.require,function(){r.utils.clearSplash();var n=arguments;e(document).ready(function(){t.go.apply(t.go,n)})})):(r.utils.clearSplash(),e(document).ready(function(){t.go()}))},stackTrace:function(){return(new Error).stack},shortcut:function(e,t,n){return e[t].apply(e,n)},get:function(){return this.shortcut(this.classes,"get",arguments)},getById:function(){return this.shortcut(this.classes,"getById",arguments)},create:function(){return this.shortcut(this.classes,"create",arguments)},define:function(){return this.shortcut(this.classes,"define",arguments)},createController:function(){return this.shortcut(this.controllers,"createController",arguments)},require:function(){return this.shortcut(this.utils,"require",arguments)},loadRaw:function(){return this.shortcut(this.views,"loadRaw",arguments)},createView:function(){return this.shortcut(this.views,"createView",arguments)},defineView:function(){return this.shortcut(this.views,"defineView",arguments)},getBody:function(){return this.shortcut(this.views,"getBody",arguments)},delay:function(){return this.shortcut(this.utils,"delay",arguments)},addListener:function(){return this.shortcut(this.events,"addListener",arguments)},removeListener:function(){return this.shortcut(this.events,"removeListener",arguments)},fireEvent:function(){return this.shortcut(this.events,"fireEvent",arguments)},on:function(){return this.shortcut(this.events,"on",arguments)},off:function(){return this.shortcut(this.events,"off",arguments)},createStore:function(){return this.shortcut(this.data.store,"createStore",arguments)},text:function(){return this.shortcut(this.languages,"getByKey",arguments)},classes:{classRegistry:{},get:function(e){return this.classRegistry[e]},getById:function(e){var t=this,n,r,i;for(r in t.classRegistry)if(t.classRegistry.hasOwnProperty(r)){i=t.classRegistry[r];if(i.getClassId&&i.getClassId()===e){n=i;break}}return n},removeClass:function(e){delete n.classes.classRegistry[typeof e=="string"?e:e._classname]},_callParentConstructor:function(e,t){return function(){var r=this,i=n.utils.uniqId(),s;r.callParent&&(s="_scope_callParent_"+i,r[s]=r.callParent),r.callParent=function(e){return t.apply(r,e)};var o=e.apply(r,arguments);return s?(r.callParent=r[s],delete r[s]):delete r.callParent,o}},extend:function(t,n){var r=this,i={},s;for(s in t)t.hasOwnProperty(s)&&(i[s]=Object.getOwnPropertyDescriptor(t,s),n[s]&&e.isFunction(n[s])&&e.isFunction(t[s])&&(i[s].value=r._callParentConstructor(i[s].value,n[s])));var o=Object.create(n);return Object.create(Object.getPrototypeOf(o),i)},create:function(e,t){var n=this,r;return n.classRegistry[e]?(r=n.classRegistry[e],r=n.extend(t,r)):r=n.define(e,t),r.init&&r.init(),r},_initMixins:function(t){if(t.mixins){var r=function(t,r){return e.isPlainObject(r)?r._mixedIn||(r._mixedIn=!0,n.utils.overwrite(t,r)):typeof r=="string"&&(t.hasMixin(r)||(t.mixinAdded(r),r=Object.getPrototypeOf(Object.getPrototypeOf(n.create(r))),r||new Error("unable to find mixin",t.mixins),n.utils.overwrite(t,r))),r};if(e.isArray(t.mixins))for(var i=0,s=t.mixins.length;i<s;i++)t.mixins[i]=r(t,t.mixins[i]);else t.mixins=r(t,t.mixins)}return t},define:function(e,t){var n=this,r;if(t.extend){var i=n.classRegistry[t.extend];r=n.extend(t,i),r=n._initMixins(r)}else r=Object.create(t);return e&&(n.classRegistry[e]=r),r.constructor&&r.constructor(e),r},overwrite:function(e,t){return n.utils.overwrite(n.get(e),t)}},controllers:{createController:function(e,t){return t=t||{},t.extend="Firebrick.controller.Base",n.create(e,t)}},templates:{loadingTpl:"<div class='fb-view-loader'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></div>"},views:{bootView:function(e){return n.utils.clearSplash(),n.createView(n.app.name+".view.Index",{target:"body",store:e.viewData,async:!0,listeners:{ready:function(){n.fireEvent("viewReady",this)}}})},createView:function(t,r){return t&&!r&&(e.isPlainObject(t)?(r=t,t=null):r={}),r=this._basicViewConfigurations(r),n.create(t,r)},defineView:function(e,t){var r=this;return t=r._basicViewConfigurations(t),n.define(e,t)},initSubViews:function(t){var n=this,r=t.subViews;if(r)if(e.isArray(r))for(var i=0,s=r.length;i<s;i++)t.subViews[i]=n._loadSubView(r[i]);else t.subViews=n._loadSubView(r);return t},_loadSubView:function(t){if(typeof t=="string")t=n.createView(t,{autoRender:!1});else if(e.isPlainObject(t)&&t.isView)if(t._state==="unbound")t=t.render();else{var r=n.createView(t._classname);t=r,n.classes.classRegistry[t._classname]=r}return t},loadRaw:function(e){var t;return n.utils.require(e,function(e){t=e},!1,"html","html"),t},_basicViewConfigurations:function(e){return e=e||{},e.extend||(e.extend="Firebrick.view.Base"),e},_body:null,getBody:function(t){var n=this;if(t===!0||!n._body)n._body=e("body");return n._body},getTarget:function(t){var n=t&&t.jquery?t:e(t);return n.length>0?n:null},renderTo:function(e,t,n){return n===!0?e.append(t):e.html(t)}},boot:{prepApplication:function(t){t.cache===!1&&(require.config({urlArgs:"fb="+(new Date).getTime()}),e.ajaxSetup({cache:!1})),t.dev&&(requirejs.onError=function(e){e.requireType==="timeout"?console.log("modules: "+e.requireModules):(console.error(e.message),console.error(e.text),console.error(e.requireMap),console.error(e.stack),new Error(e))}),t.lang&&n.languages.init(t.lang),t.autoRender!==!1&&n.views.bootView(t)}},utils:{requiredFiles:{},intervalRegistry:{},splashCleared:!1,initSplash:function(t){var r=this;n.delay(function(){r.splashCleared||e("html").append("<div id='fb-splash'>"+t+"</div>")},1)},clearSplash:function(){this.splashCleared=!0,e("#fb-splash").remove()},overwrite:function(e,t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},merge:function(e,t,n){var r=this,i=Object.getPrototypeOf(n||t);if(i.hasOwnProperty(e)){var s,o,u=i[e];for(s in u)u.hasOwnProperty(s)&&(o=u[s],s in t[e]||(t[e][s]=o));r.merge(e,t,i)}return t},delay:function(e,t,n,r){window.setTimeout(function(t){e.apply(r||this,t)},t,n)},clearInterval:function(e){var t=this,n=t.intervalRegistry[e];n&&(window.clearInterval(n.intId),delete this.intervalRegistry[e])},setInterval:function(){var t=this,n=arguments[0],r=e.isFunction(n)?n.id:n,i;return t.isIntervalRunning(r)||(e.isFunction(n)?i=t._applyInterval(null,arguments[0],arguments[1],arguments[2]):i=t._applyInterval.apply(this,arguments)),i},_applyInterval:function(e,t,n,r){var i=this;e=e||i.uniqId();var s=function(){t.id=e,t.apply(r||t,arguments)};return s.intId=window.setInterval(s,n),i.intervalRegistry[e]=s,e},isIntervalRunning:function(e){return this.intervalRegistry[e]},stripArguments:function(t){return e.isPlainObject(t)&&e.isNumeric(t.length)&&t.hasOwnProperty("callee")&&t.length&&(t=t[0]),t},require:function(t,n,r,i,s){var o=this,u,a={},f,l;i=i||"script",s=s||"js",e.isArray(t)||(t=[t]),t=t.filter(function(e){return!o.requiredFiles[e]}),f=t.length,l=function(){f--,f===0&&n&&e.isFunction(n)&&n.apply(this,arguments)};var c;for(var h=0,p=t.length;h<p;h++)c=t[h],o.requiredFiles[c]=!0,u=o.getPathFromName(c,s),e.ajax({async:typeof r=="boolean"?r:!0,dataType:i,url:u,success:o._requireSuccessCallback(p,c,a,l),error:o._requireErrorCallback(c,u,l)});return t},_requireSuccessCallback:function(e,t,n,r){return function(){e>1?(n[t]=arguments,r.call(this,n)):r.apply(this,arguments)}},_requireErrorCallback:function(e,t,n){return function(r,i,s){console.warn("unable to load file/class '",e,"' at:",t),console.error(i,s),n.apply(this,arguments)}},getPathFromName:function(e,t){var r=n.app.path,i=n.app.name;return t=t||"js",r.charAt(r.length-1)==="/"&&(r=r.substr(0,r.length-1)),e=e.trim(),e.indexOf(".")>0&&e.indexOf(i)===0?(e=e.replace(i,r),e.replace(/\./g,"/")+"."+t):r+"/"+e},_globalC:1,uniqId:function(){var e=this,t=new Date,n=t.getMilliseconds()+"",r=++t+n+(++e._globalC===1e4?e._globalC=1:e._globalC);return r},loadCSS:function(e){var t=document.createElement("link");t.type="text/css",t.rel="stylesheet",t.href=e,document.getElementsByTagName("head")[0].appendChild(t)}},languages:{lang:t.observable("en"),keys:t.observable({}),init:function(e){var t=this;typeof e=="string"?n.createStore({url:e,autoLoad:!1}).load({callback:function(){t.keys(this.getData())}}):e.isStore?t.keys=e.getData():console.error("unable to load languages",e)},getByKey:function(t){t=e.isFunction(t)?t():t;var n=this,r=t.toLowerCase(),i=n.keys()[n.lang()];return i&&i[r]?i[r]:t},setLang:function(e){this.lang(e)},getLang:function(){return this.lang()},allLanguages:function(){var e=this,n=[],r=t.mapping.toJS(e.keys),i;for(i in r)r.hasOwnProperty(i)&&n.push(i);return n}},events:{eventRegistry:{},eventCounter:0,addListener:function(t,n,r){var i=this;return e.isPlainObject(t)?i._addListener(t):n.conf?n:(n.conf={},n.conf.callbackId=i.eventCounter++,n.conf.scope=r,i.eventRegistry[t]||(i.eventRegistry[t]=[]),i.eventRegistry[t].push(n),n)},_addListener:function(e){var t=this,n=e.scope,r;delete e.scope;for(r in e)e.hasOwnProperty(r)&&t.addListener(r,e[r],n)},removeListener:function(e,t){var n=this,r=n.eventRegistry[e];if(r)if(t.conf.callbackId||t.conf.callbackId===0)for(var i=0,s=r.length;i<s;i++)r[i].conf.callbackId===t.conf.callbackId&&(r.splice(i,1),r.length===0&&delete n.eventRegistry[e]);else console.warn("No callbackId for function whilst trying to remove listener");else console.warn("Unable to remove listener. No events found for:",e)},fireEvent:function(e){var t=this,n=t.eventRegistry[e];if(n){var r=Array.slice(arguments),i=t.createEventData(e);for(var s=0,o=n.length;s<o;s++){var u=n[s];i.conf=u.conf,i.funct=u,r.unshift(i),u.apply(u.conf.scope||window,r)}}},createEventData:function(e){var t=this,n={event:e,conf:null,removeSelf:function(){t.removeListener(e,n.funct)}};return n},on:function(t,n,r,i){var s=this;return e.isPlainObject(t)?s._on(t):s._registerOnEvent(t,n,r,i)},off:function(t,n,r){e(document.body).off(t,n,r)},_on:function(e){var t=this,n=e.scope,r,i,s;delete e.scope;for(r in e)if(e.hasOwnProperty(r)){s=e[r];for(i in s)s.hasOwnProperty(i)&&t._registerOnEvent(i,r,s[i],n)}},_registerOnEvent:function(t,n,r,i){e(document).on(t,n,function(){var e=Array.slice(arguments);e.push(this),r.apply(i||this,e)})}},data:{store:{createStore:function(e,t){var r=this;if(typeof e=="string"){var i=n.get(e);return i?(i=n.classes.extend(t,i),i.init()):(t=r._basicStoreConfigurations(t),i=n.create(e,t)),i}t=e||{};var s=n.get("Firebrick.store.Base");return n.classes.extend(t,s).init()},_basicStoreConfigurations:function(e){return e=e||{},e.extend||(e.extend="Firebrick.store.Base"),e},_loadStore:function(t,n){n=n||{};var r=t.url,i=n.async;return typeof i!="boolean"&&(i=t.async),e.isPlainObject(r)&&(r=r.get),t.status="preload",e.ajax({datatype:t.datatype,async:i,url:t.url,success:function(r,i,s){t.setData(r),t.status=i,e.isFunction(n.callback)&&n.callback.apply(n.scope||t,[t,r,i,s])},error:function(e,n,r){console.warn("unable to load store '",t.classname,"' with path:",t.url),console.error(n,r)}}),t},_submit:function(t,n){var r;return t&&t.url&&t.url.submit?(t.status="presubmit",r=t.toJson(),e.ajax({url:t.url.submit,data:{data:t.toJson()},type:t.protocol,beforeSend:function(){return t.fireEvent("beforeSubmit",t,r)},success:function(e,r){t.status=r,n&&n.apply(t,arguments)},error:function(){console.error("error submitting data for store to url",t.url.submit,t)}})):console.error("unable to submit store, no submit path found (url.submit)",t),t}}},router:{set:function(t){var r=this,i=function(){};return e.isFunction(t)?i=t:e.isPlainObject(t)&&(i=function(){var e;for(e in t)if(t.hasOwnPropery(e)&&n.router.is("#"+e)){t[e].apply(this,arguments);break}}),r.onHashChange(i)},onHashChange:function(t){return e(window).on("hashchange",function(){t.apply(this,arguments)})},is:function(e){return e.indexOf("#")!==-1?window.location.hash===e:window.location.href.replace(window.location.origin)===e}}};return n.define("Firebrick.class.Base",{constructor:function(e){var t=this;return e&&(t._classname=e),t},_cloneListener:function(e){return function(){var t=e.apply(this,arguments);return t}},init:function(){var t=this,r,i;if(t.listeners){n.utils.merge("listeners",t);for(r in t.listeners)t.listeners.hasOwnProperty(r)&&(i=t.listeners[r],e.isFunction(i)&&(t.listeners[r]=t._cloneListener(i)));t.on(t.listeners)}return t.fireEvent(t.overrideReadyEvent||"ready"),t},mixins:null,_mixins:null,mixinAdded:function(e){var t=this;return t._mixins||(t._mixins={}),t._mixins[e]=1,t},hasMixin:function(e){var t=this;return!!t._mixins&&!!t._mixins[e]},_idPrefix:"fb-",_classId:null,localEventRegistry:null,getClassId:function(){var e=this;return e._classId||(e._classId=e._idPrefix+n.utils.uniqId()),e._classId},listeners:null,on:function(t,r,i){var s=this;s.localEventRegistry||(s.localEventRegistry={});var o=function(e,t,r){s.localEventRegistry[e]||(s.localEventRegistry[e]=[]),t.id=n.utils.uniqId(),r&&(t.scope=r),s.localEventRegistry[e].push(t)};if(e.isPlainObject(t)){var u=t.scope||s,a;delete t.scope;for(a in t)t.hasOwnProperty(a)&&o(a,t[a],u)}else i=i||s,o(t,r,i);return s},off:function(e,t){var n=this,r;if(n.localEventRegistry&&n.localEventRegistry[e])for(var i=0,s=n.localEventRegistry[e].length;i<s;i++){r=n.localEventRegistry[e][i];if(r.id===t.id){n.localEventRegistry[e].splice(i,1);break}}return n},fireEvent:function(){var e=this,t=e.localEventRegistry,n=arguments,r=arguments[0];if(t&&t[r]){var i,s=t[r];for(var o=0,u=s.length;o<u;o++)i=s[o],i.apply(i.scope||i,n)}return e},passEvent:function(){return this.fireEvent.apply(this,n.utils.stripArguments(arguments))}}),n.define("Firebrick.view.Base",{extend:"Firebrick.class.Base",tpl:"",store:null,html:"",target:null,autoRender:!0,controller:null,loadingTpl:n.templates.loadingTpl,loading:!1,showLoading:!0,_state:"initial",enclosedBind:!1,subViews:null,isView:!0,viewExtension:"html",async:!0,appendTarget:!1,bindAttribute:"fb-view-bind",enclosedBindIdPrefix:"fb-view-enclosed-bind",getEnclosedBindId:function(){var e=this;return e.enclosedBindIdPrefix+"-"+e.getClassId()},_init:function(t){var r=this;r.autoRender&&r.startLoader();if(!r.tpl){var i=n.utils.require(r._classname,function(e){r.tpl=e,t.call()},r.async,"html",r.viewExtension);i.length||t.call()}else e.isFunction(r.tpl)&&(r.tpl=r.tpl()),t.call();return this},init:function(){var e=this;return e.overrideReadyEvent="base",e.on(e.overrideReadyEvent,function(){e._init(function(){e.initStore(),e.initView(),e.fireEvent("ready")})}),e.callParent(arguments)},getStore:function(){return this.store},getData:function(){var e=this,t=e.getStore();return t?t.getData():{}},initView:function(){var e=this;return e.html=e.tpl,e.autoRender&&e.getTarget()&&e.render(),e},initSubViews:function(){return n.views.initSubViews(this)},getTarget:function(){return n.views.getTarget(this.target)},isBound:function(e){return e&&e.length&&e.attr("fb-view.bind")?!0:!1},getBindTarget:function(){var t=this,n;return t.enclosedBind?(n=e("#"+t.getEnclosedBindId()),n=n.length?n:null):n=t.getTarget(),n},destroy:function(){var e=this;return e.unbind().remove(),e._state="destroyed",e},remove:function(){var e=this,t=e.getBindTarget();return t&&(e.enclosedBind?t.remove():t.empty()),e},unbind:function(){var e=this,n=e.getBindTarget(),r;return e.isBound(n)&&(r=n[0],t.cleanNode(r),n.removeAttr(e.bindAttribute)),e},bind:function(){var e=this,r=e.getTarget(),i=e.getBindTarget(),s,o,u=e.html,a;e.enclosedBind&&!i&&r&&(a="<div id='"+e.getEnclosedBindId()+"'></div>",n.views.renderTo(r,a,e.appendTarget),i=e.getBindTarget()),r&&i&&!e.isBound(i)?(s=i[0],n.views.renderTo(i,u,e.appendTarget),e.hide(),e._state="rendered",o=e.getData(),i.attr(e.bindAttribute,e.getClassId()),t.applyBindings(o,s),e.setDisposeCallback(s),e.stopLoader(),e.show(),e.fireEvent("rendered",e)):console.info("target or bindTarget where not found, unable to render and bind the data",r,i)},render:function(){var e=this,t=e.getTarget();return t?(e.fireEvent("beforeRender",e),e.unbind(),e.bind(),e.initSubViews()):console.warn("unable to render, no target found for",e.target,this),e},setDisposeCallback:function(r){var i=this;t.utils.domNodeDisposal.addDisposeCallback(r,function(t){var r=n.getById(e(t).attr(i.bindAttribute));r.unbound()})},unbound:function(){var e=this,t=e.getStore();e._state="unbound",t&&(t.fireEvent("unbound",e),e.store=null),e.fireEvent("unbound",e)},show:function(){var e=this,t=e.getTarget();t&&t.show()},hide:function(){var e=this,t=e.getTarget();t&&t.hide()},isVisible:function(){var e=this,t=e.getTarget();return t?t.is(":visible"):!1},initStore:function(){var e=this;return e.store=e.store,e.store&&!e.store.isStore&&(e.store=n.createStore({data:e.store})),e},update:function(e){var t=this;return t.getStore().setData(e),t},startLoader:function(){var e=this,t=e.getTarget();!e.loading&&t&&(e.loading=!0,n.delay(function(){e.loading&&(e.hide(),t.before("<div id='fb-loader-"+e.getClassId()+"'>"+e.loadingTpl+"</div>"))},1))},stopLoader:function(){var t=this;t.loading&&(e("#fb-loader-"+t.getClassId()).remove(),t.show(),t.loading=!1)}}),n.define("Firebrick.controller.Base",{extend:"Firebrick.class.Base",init:function(){return this.callParent(arguments)},app:{on:function(){return n.events.on.apply(n.events,arguments)},listeners:function(){return n.events.addListener.apply(n.events,arguments)}}}),n.define("Firebrick.store.Base",{extend:"Firebrick.class.Base",init:function(){var e=this;return e.dataInitialised||(e.autoLoad?e.load():e.data&&e.setData(e.data)),e.autoDestroy&&e.on("unbound",function(){e.autoDestroy&&(e.data=null,e.status="destroyed",n.classes.removeClass(e))}),this.callParent(arguments)},datatype:"json",url:{get:null,submit:null},protocol:"POST",status:"initial",isStore:!0,dataInitialised:!1,autoLoad:!1,data:null,_initialData:null,async:!0,root:null,autoDestroy:!0,load:function(e){return n.data.store._loadStore(this,e)},getData:function(){var t=this;return t.root&&e.isPlainObject(t.data)?e.isFunction(t.data[t.root])?t.data[t.root]():t.data[t.root]:t.data},getRawData:function(n){var r=this;if(n)return r._initialData;var i=r.getData();return i=e.isFunction(i)?i():i,t.toJS(i)},setData:function(e){var n=this;return n.dataInitialised?e.__ko_mapping__?console.error("cannot update store data using a mapped object",e):(n._initialData=e,t.mapping.fromJS(e,n.data)):(e.__ko_mapping__||(n._initialData=e,e=t.mapping.fromJS(e)),n.data=e,n.dataInitialised=!0),n},submit:function(){return n.data.store._submit(this)},toPlainObject:function(){var n=this;return e.isFunction(n.data)?t.toJs(n.data):e.isPlainObject(n.data)&&n.data.__ko_mapping__?t.mapping.toJS(n.data):n.data},toJson:function(){return JSON.stringify(this.toPlainObject())}}),window.Firebrick=n,window.fb=window.Firebrick,n});