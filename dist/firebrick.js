/*!
* Firebrick JS - JavaScript MVC Framework powered by jQuery and Knockout JS
* @author Steven Masala [me@smasala.com]
* dependencies: jquery, knockout js
*/

(function(e,t){typeof define=="function"&&define.amd?define(["jquery","knockout","knockout-mapping","text"],function(e,n,r){return n.mapping=r,t(e,n)}):t(e.jQuery,e.ko)})(this,function(e,t){if(window.Firebrick||window.fb){console.error("unable to initialise FirebrickJS, window.Firebrick or window.fb are already defined");return}var n={version:"0.10.4",app:{name:""},ready:function(t){var r=this;r.app=t.app,r.utils.initSplash(t.splash||r.templates.loadingTpl),n.boot.prepApplication(t),t.require&&t.require.length>0?(e.isArray(t.require)||(t.require=[t.require]),require(t.require,function(){r.utils.clearSplash();var n=arguments;e(document).ready(function(){t.go.apply(t.go,n)})})):(r.utils.clearSplash(),e(document).ready(function(){t.go()}))},stackTrace:function(){return(new Error).stack},shortcut:function(e,t,n){return e[t].apply(e,n)},get:function(){return this.shortcut(this.classes,"get",arguments)},getById:function(){return this.shortcut(this.classes,"getById",arguments)},create:function(){return this.shortcut(this.classes,"create",arguments)},define:function(){return this.shortcut(this.classes,"define",arguments)},createController:function(){return this.shortcut(this.controllers,"createController",arguments)},require:function(){return this.shortcut(this.utils,"require",arguments)},loadRaw:function(){return this.shortcut(this.views,"loadRaw",arguments)},createView:function(){return this.shortcut(this.views,"createView",arguments)},defineView:function(){return this.shortcut(this.views,"defineView",arguments)},getBody:function(){return this.shortcut(this.views,"getBody",arguments)},delay:function(){return this.shortcut(this.utils,"delay",arguments)},addListener:function(){return this.shortcut(this.events,"addListener",arguments)},removeListener:function(){return this.shortcut(this.events,"removeListener",arguments)},fireEvent:function(){return this.shortcut(this.events,"fireEvent",arguments)},on:function(){return this.shortcut(this.events,"on",arguments)},off:function(){return this.shortcut(this.events,"off",arguments)},createStore:function(){return this.shortcut(this.data.store,"createStore",arguments)},text:function(){return this.shortcut(this.languages,"getByKey",arguments)},scrollTopOffset:0,scrollContainerSelector:"body, html",classes:{_classRegistry:{},_createdClasses:{},_sNames:{},get:function(e){var t=this;return t._classRegistry[e]},addSNames:function(e){var t=this;return t._sNames=n.utils.overwrite(t._sNames,e),t._sNames},getById:function(e){var t=this;return e?t._createdClasses[e]:null},getSNameConfig:function(e){return this._sNames[e.toLowerCase()]},removeClass:function(e){var t=typeof e=="string"?n.get(e):e;t&&t.id&&delete n.classes._createdClasses[t.id]},_callParentConstructor:function(e,t){return function(){var r=this,i=n.utils.uniqId(),s;r.callParent&&(s="_scope_callParent_"+i,r[s]=r.callParent),r.callParent=function(e){return t.apply(r,e)};var o=e.apply(r,arguments);return s?(r.callParent=r[s],delete r[s]):delete r.callParent,o}},extend:function(t,n){var r=this,i={},s;for(s in t)t.hasOwnProperty(s)&&(i[s]=Object.getOwnPropertyDescriptor(t,s),n[s]&&e.isFunction(n[s])&&e.isFunction(t[s])&&(i[s].value=r._callParentConstructor(i[s].value,n[s])));var o=Object.create(n);return Object.create(Object.getPrototypeOf(o),i)},create:function(e,t){var r=this,i=r.get(e);return i?i=r.extend(t,i):i=r.define(e,t||{}),i.initialConfig=t,i.id||(i.id=i.getId?i.getId():n.utils.uniqId()),r._createdClasses[i.id]=i,i.init&&i.init(),i},_initMixins:function(t,r){var i=this;if(t.hasOwnProperty("mixins")){var s=function(t,r){return e.isPlainObject(r)?i._doMix(t,r):typeof r=="string"&&(i._mixinAdded(t,r),r=n.get(r),r||new Error("unable to find mixin",t.mixins),i._doMix(t,r)),r};if(e.isArray(t.mixins))for(var o=0,u=t.mixins.length;o<u;o++)t.mixins[o]=s(t,t.mixins[o]);else t.mixins=s(t,t.mixins)}return t},_mixinAdded:function(e,t){var n=this;return e._mixins||(e._mixins={}),e._mixins[t]=1,n},hasMixin:function(e,t){var n=e;return!!n._mixins&&!!n._mixins[t]},_doMix:function(e,t){return n.utils.overwrite(e,t)},define:function(e,t){var r=this,i,s,o=t.extend,u=arguments;if(!o)return r._define.apply(r,u);i=r.get(o);if(!!i)return r._define.apply(r,u);s=r.getSNameConfig(o).path||require.toUrl(n.utils.getPathFromName(o)),console.warn(s,"is being loaded on demand, try preloading it before hand for better performance:",o),require([s],function(){r._define.apply(r,u)})},_define:function(e,t){var n=this,r,i,s=t.extend;return s?(i=n.get(s),i||console.error("unable load super class",s,"for class",e),r=n.extend(t,i)):r=t,r=n._initMixins(r,e),e&&(r._classname=e,r.fbTmpClass||(n._classRegistry[e]=r,r.hasOwnProperty("sName")&&r.sName&&(n._classRegistry[r.sName]=r))),r.constructor&&r.constructor(e),r},overwrite:function(e,t){return n.utils.overwrite(n.get(e),t)}},controllers:{createController:function(e,t){return t=t||{},typeof e!="string"&&(e="tmp"+n.utils.uniqId(),t.fbTmpClass=!0),t.extend="Firebrick.controller.Base",n.create(e,t)}},templates:{loadingTpl:"<div class='fb-view-loader'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></div>"},views:{bootView:function(e){return n.utils.clearSplash(),n.createView(n.app.name+".view.Index",{target:e.target||"body",store:e.viewData,async:!0,listeners:{ready:function(){n.fireEvent("viewReady",this)}}})},createView:function(t,r){return t&&!r&&(e.isPlainObject(t)?(r=t,t="tmp-"+n.utils.uniqId(),r.fbTmpClass=!0):r={}),r=this._basicViewConfigurations(r),n.create(t,r)},defineView:function(e,t){var r=this;return t=r._basicViewConfigurations(t),n.define(e,t)},initSubViews:function(t){var n=this,r=t.subViews;if(r)if(e.isArray(r))for(var i=0,s=r.length;i<s;i++)t.subViews[i]=n._loadSubView(r[i]);else t.subViews=n._loadSubView(r);return t},_loadSubView:function(t){if(typeof t=="string")t=n.createView(t,{autoRender:!1});else if(e.isPlainObject(t)&&t.isView)if(t._state==="unbound")t=t.render();else{var r=n.createView(t._classname);t=r,n.classes._classRegistry[t._classname]=r}return t},_basicViewConfigurations:function(e){return e=e||{},e.extend||(e.extend="Firebrick.view.Base"),e},_body:null,getBody:function(t){var n=this;if(t===!0||!n._body)n._body=e("body");return n._body},getTarget:function(t){var n=t&&t.jquery?t:e(t);return n.length>0?n:null},renderTo:function(e,t,n){return n===!0?e.append(t):e.html(t)}},boot:{prepApplication:function(t){t.cache===!1&&(require.config({urlArgs:"fb="+(new Date).getTime()}),e.ajaxSetup({cache:!1})),t.dev&&(requirejs.onError=function(e){e.requireType==="timeout"?console.log("modules: "+e.requireModules):(console.error(e.message),console.error(e.text),console.error(e.requireMap),console.error(e.stack),new Error(e))}),t.lang&&n.languages.init(t.lang),t.autoRender!==!1&&n.views.bootView(t)}},utils:{requiredFiles:{},intervalRegistry:{},splashCleared:!1,initSplash:function(t){var r=this;n.delay(function(){r.splashCleared||e("html").append("<div id='fb-splash'>"+t+"</div>")},1)},clearSplash:function(){this.splashCleared=!0,e("#fb-splash").remove()},overwrite:function(e,t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},copyover:function(e,t){var n;for(n in t)t.hasOwnProperty(n)&&!e[n]&&(e[n]=t[n]);return e},merge:function(e,t,n){var r=this,i=Object.getPrototypeOf(n||t);if(i.hasOwnProperty(e)){var s,o,u=i[e];for(s in u)u.hasOwnProperty(s)&&(o=u[s],s in t[e]||(t[e][s]=o));r.merge(e,t,i)}else Object.getPrototypeOf(i)&&r.merge(e,t,i);return t},delay:function(e,t,n,r){window.setTimeout(function(t){e.apply(r||this,t)},t,n)},clearInterval:function(e){var t=this,n=t.intervalRegistry[e];n&&(window.clearInterval(n.intId),delete this.intervalRegistry[e])},setInterval:function(){var t=this,n=arguments[0],r=e.isFunction(n)?n.id:n,i;return t.isIntervalRunning(r)||(e.isFunction(n)?i=t._applyInterval(null,arguments[0],arguments[1],arguments[2]):i=t._applyInterval.apply(this,arguments)),i},_applyInterval:function(e,t,n,r){var i=this;e=e||i.uniqId();var s=function(){t.id=e,t.stop=function(){i.clearInterval(e)},t.apply(r||t,arguments)};return s.intId=window.setInterval(s,n),i.intervalRegistry[e]=s,e},isIntervalRunning:function(e){return!!this.intervalRegistry[e]},stripArguments:function(t){return e.isPlainObject(t)&&e.isNumeric(t.length)&&t.hasOwnProperty("callee")&&t.length&&(t=t[0]),t},require:function(t,n){return n=n||function(){},t=e.isArray(t)?t:[t],require(t,n),t},getPathFromName:function(e,t){var r=n.app.name;return t=t||"",e=e.trim(),e.indexOf(".")>0&&e.indexOf(r)===0?(e=e.replace(r,""),r+e.replace(/\./g,"/")+(t?"."+t:"")):e},_globalC:1,uniqId:function(){var e=this,t=new Date,n=t.getMilliseconds()+"",r=++t+n+(++e._globalC===1e4?e._globalC=1:e._globalC);return r},loadCSS:function(e){var t=document.createElement("link");t.type="text/css",t.rel="stylesheet",t.href=e,document.getElementsByTagName("head")[0].appendChild(t)}},languages:{lang:t.observable("en"),keys:t.observable({}),init:function(t){var r=this;typeof t=="string"?n.createStore({url:t,autoLoad:!1}).load({callback:function(){r.keys(this.getData())}}):t.isStore?r.keys(t.getData()):e.isPlainObject?r.keys(t):console.error("unable to load languages",t)},getByKey:function(t){var n=this,r;return t=e.isFunction(t)?t():t,r=n.keys()[n.lang()],r&&r[t]?e.isFunction(r[t])?r[t]():r[t]:t},setLang:function(e){this.lang(e)},getLang:function(){return this.lang()},allLanguages:function(){var e=this,n=[],r=t.mapping.toJS(e.keys),i;for(i in r)r.hasOwnProperty(i)&&n.push(i);return n}},events:{_eventRegistry:{},addListener:function(t,r,i){var s=this;return e.isPlainObject(t)?s._addListener(t):r.conf?r:(r.conf={},r.conf.callbackId=n.utils.uniqId(),r.conf.scope=i,s._eventRegistry[t]||(s._eventRegistry[t]=[]),s._eventRegistry[t].push(r),r)},_addListener:function(e){var t=this,n=e.scope,r;delete e.scope;for(r in e)e.hasOwnProperty(r)&&t.addListener(r,e[r],n)},removeListener:function(e,t){var n=this,r=n._eventRegistry[e],i;r&&r.length?t?t.conf.callbackId?(i=r.filter(function(e){return e.conf.callbackId!==t.conf.callbackId?!0:!1}),i.length===0?delete n._eventRegistry[e]:n._eventRegistry[e]=i):console.warn("No callbackId for function whilst trying to remove listener"):delete n._eventRegistry[e]:console.warn("Unable to remove listener. No events found for:",e)},fireEvent:function(e){var t=this,n=t._eventRegistry[e],r,i;if(n){r=Array.prototype.slice.call(arguments),i=t.createEventData(e),r.shift();for(var s=0,o=n.length;s<o;s++){var u=n[s];i.conf=u.conf,i.funct=u,r.unshift(i),u.apply(u.conf.scope||window,r)}}},createEventData:function(e){var t=this,n={event:e,conf:null,removeSelf:function(){t.removeListener(e,n.funct)}};return n},on:function(t,n,r,i){var s=this;return e.isPlainObject(t)?s._on(t):s._registerOnEvent(t,n,r,i)},off:function(t,n,r){r.offFunc&&e(document).off(t,n,r.offFunc)},_on:function(e){var t=this,n=e.scope,r,i,s;delete e.scope;for(r in e)if(e.hasOwnProperty(r)){s=e[r];for(i in s)s.hasOwnProperty(i)&&t._registerOnEvent(i,r,s[i],n)}},_registerOnEvent:function(t,r,i,s){var o=function(){var e=Array.prototype.slice.call(arguments);e.push(this),this.destroy=function(){n.events.off(t,r,i)},i.apply(s||this,e)};i.offFunc=o,e(document).on(t,r,o)}},data:{store:{createStore:function(e,t){var r=this;if(typeof e=="string"){var i=n.get(e);return i?(i=n.classes.extend(t,i),i.init()):(t=r._basicStoreConfigurations(t),i=n.create(e,t)),i}return t=e||{},t=r._basicStoreConfigurations(t),e="tmp-"+n.utils.uniqId(),t.fbTmpClass=!0,n.create(e,t)},_basicStoreConfigurations:function(e){return e=e||{},e.extend||(e.extend="Firebrick.store.Base"),e},_loadStore:function(t,n){var r=t.url,i,s;return n=n||{},i=n.async,e.isFunction(n)&&(n={callback:n}),typeof i!="boolean"&&(i=t.async),e.isPlainObject(r)&&(r=r.get),t.status="preload",s=t.toPlainObject(),e.ajax({dataType:t.datatype,type:t.loadProtocol,async:i,url:t.getUrl(),data:t.stringifyData?{data:JSON.stringify(s)}:s,success:function(r,i,s){t.setData(r),t.status=i,e.isFunction(n.callback)&&n.callback.call(n.scope||t,t,r,i,s)},error:function(r,i,s){e.isFunction(n.error)?n.error.call(n.scope||t,r,i,s):(console.warn("unable to load store '",t._classname,"' with path:",t.url),console.error(r,i,s))}}),t},_submit:function(t,n){var r;return t&&t.url&&t.url.submit?(t.status="presubmit",r=t.toPlainObject(),e.ajax({url:t.getUrl("submit"),data:t.stringifyData?{data:JSON.stringify(r)}:r,type:t.submitProtocol,beforeSend:function(){return t.fireEvent("beforeSubmit",t,r)},success:function(e,r){t.status=r,n&&n.apply(t,arguments)},error:function(e,n,r){console.error("error submitting data for store to url",t.url.submit,t),console.error(e,n,r)}})):console.error("unable to submit store, no submit path found (url.submit)",t),t}}},router:{_cache:[],set:function(t){var n=this,r;return e.isFunction(t)?r=t:e.isPlainObject(t)&&(r=n._createRouterFunction(t)),n._cache.push(r),n.onHashChange(r)},_createRouterFunction:function(e){var t=this;return function(){var r,i=!1;for(r in e)if(e.hasOwnProperty(r)&&r!=="defaults"&&n.router.is(r)){t._applyRoute(e[r],arguments),i=!0;break}i||e.defaults&&t._applyRoute(e.defaults,arguments)}},_applyRoute:function(t,r){var i=this,s,o,u=[];e.isPlainObject(t)&&t.require?(s=t.require,e.isArray(s)||(s=[s]),require(s,function(){t.callback&&(u.push(n.utils.stripArguments(r)),u.push(n.utils.stripArguments(arguments)),t.callback.apply(i,u)),i._defaultRouteActions()})):(e.isPlainObject(t)?o=t.callback:o=t,o.apply(i,r),i._defaultRouteActions())},_defaultRouteActions:function(){var t=this,r=t.getRoute(),i=n.scrollTopOffset,s=e(n.scrollContainerSelector);e.isFunction(i)&&(i=i(r)),r.parameters.scrollTo&&s.animate({scrollTop:e("#"+r.parameters.scrollTo).offset().top-i+s.scrollTop()},{duration:1e3,complete:function(){}})},onHashChange:function(t){return e(window).on("hashchange",function(){t.apply(this,arguments)})},is:function(e){var t=this,n=t.getRoute(),r=n.cleanHash;return r?r===e:n.path===e},getRoute:function(){var e=this,t=window.location,n=t.href.replace(t.origin,""),r=t.hash,i=r.indexOf("?");return{href:t.href,origin:t.origin,path:n,hash:r,cleanHash:i!==-1?r.substr(0,i):r,parameters:e.getUrlParam(n)}},getUrlParam:function(e){var t=e,n={},r,i=/[?&]?([^=]+)=([^&]*)/g;t=t.substr(t.indexOf("?")+1,t.length),t=t.split("+").join(" ");while(r=i.exec(t))n[decodeURIComponent(r[1])]=decodeURIComponent(r[2]);return n},init:function(){var e=this;for(var t=0,n=e._cache.length;t<n;t++)e._cache[t]()}}};return n.define("Firebrick.class.Base",{initialConfig:null,_cloneListener:function(e){return function(){return e.apply(this,arguments)}},sName:null,init:function(){var t=this,r,i,s={};if(t.listeners){n.utils.merge("listeners",t);for(r in t.listeners)t.listeners.hasOwnProperty(r)&&(i=t.listeners[r],e.isFunction(i)&&(s[r]=t._cloneListener(i,r)));t.listeners=s,t.on(t.listeners)}return t.fireEvent("preReady"),t.fireEvent(t.classReadyEvent),t},classReadyEvent:"ready",autoDestroy:!0,mixins:null,_mixins:null,_idPrefix:"fb-",id:null,localEventRegistry:null,getId:function(){var e=this,t=e.id;return t||(t=e._idPrefix+n.utils.uniqId(),e.id=t),t},destroy:function(){n.classes.removeClass(this)},listeners:null,on:function(t,r,i){var s=this;s.localEventRegistry||(s.localEventRegistry={});var o=function(e,t,r){s.localEventRegistry[e]||(s.localEventRegistry[e]=[]),t.id=n.utils.uniqId(),r&&(t.scope=r),s.localEventRegistry[e].push(t)};if(e.isPlainObject(t)){var u=t.scope||s,a;delete t.scope;for(a in t)t.hasOwnProperty(a)&&o(a,t[a],u)}else i=i||s,o(t,r,i);return s},off:function(e,t){var n=this,r;if(n.localEventRegistry&&n.localEventRegistry[e])for(var i=0,s=n.localEventRegistry[e].length;i<s;i++){r=n.localEventRegistry[e][i];if(r.id===t.id){n.localEventRegistry[e].splice(i,1);break}}return n},fireEvent:function(){var e=this,t=e.localEventRegistry,n=arguments,r=arguments[0];if(t&&t[r]){var i,s=t[r];for(var o=0,u=s.length;o<u;o++)i=s[o],i.apply(i.scope||i,n)}return e},passEvent:function(){return this.fireEvent.apply(this,n.utils.stripArguments(arguments))}}),n.define("Firebrick.view.Base",{extend:"Firebrick.class.Base",tpl:"",store:null,html:"",target:null,autoRender:!0,controller:null,loadingTpl:n.templates.loadingTpl,loading:!1,showLoading:!0,_state:"initial",applyBindingsToDescendants:!1,enclosedBind:!1,subViews:null,isView:!0,async:!0,appendTarget:!1,bindAttribute:"fb-view-bind",enclosedBindIdPrefix:"fb-enclosed-bind-",_init:function(t){var r=this,i;return r.autoRender&&r.startLoader(),r.tpl?(e.isFunction(r.tpl)&&(r.tpl=r.tpl()),t.call()):(i=require.toUrl(n.utils.getPathFromName(r._classname,"html")),require(["text!"+i],function(e){r.tpl=e,t.call()})),this},init:function(){var e=this,t=e.classReadyEvent;return e.classReadyEvent="base",e.on(e.classReadyEvent,function(){e._init(function(){e.initStore(),e.initView(),e.fireEvent(t)})}),e.callParent(arguments)},getStore:function(){return this.store},getData:function(){var e=this,t=e.getStore();return t?t.getData():{}},initView:function(){var e=this;return e._html=e.tpl,e.autoRender&&e.getTarget()&&e.render(),e},initSubViews:function(){return n.views.initSubViews(this)},getTarget:function(){var e=this;return n.views.getTarget(e.target)},isBound:function(){return this._isBound(!0)},isTargetBound:function(){return this._isBound()},_isBound:function(e){var t=this,n=t.enclosedBind?t.getEnclosedTarget():t.getTarget();if(n&&n.length&&n.attr("fb-view-bind"))return e===!0?n.attr("id")===t.getId()?!0:!1:!0;return!1},destroy:function(){var e=this;return e.unbind().remove(),e._state="destroyed",e.callParent(arguments)},getEnclosedBindId:function(){var e=this;return e.enclosedBindIdPrefix+e.getId()},remove:function(){var e=this,t=e.enclosedBind?n.views.getTarget("#"+e.getEnclosedBindId()):e.getTarget();return t&&(e.applyBindingsToDescendants||e.enclosedBind?t.remove():t.empty()),e},unbind:function(){var e=this,r=e.enclosedBind?n.views.getTarget("#"+e.getEnclosedBindId()):e.getTarget(),i;return e.isTargetBound()&&(i=r[0],t.cleanNode(i),r.removeAttr(e.bindAttribute)),e},getEnclosedTarget:function(){return n.views.getTarget("#"+this.getEnclosedBindId())},prepHtml:function(){var t=this,n,r=t._html;return t.enclosedBind&&(n=t.getEnclosedTarget(),n||(r=e('<div id="'+t.getEnclosedBindId()+'"></div>').html(r))),r},_renderHTML:function(){var e=this,t=e.getTarget(),r,i;return r=e.prepHtml(),e.enclosedBind?(i=e.getEnclosedTarget(),i?n.views.renderTo(i,r,!1):n.views.renderTo(t,r,e.appendTarget)):n.views.renderTo(t,r,e.appendTarget),e.fireEvent("htmlRendered"),e},bindContent:function(){var e=this,n=e.getData(),r=e.getTarget(),i=r[0];e.enclosedBind&&(r=e.getEnclosedTarget(),i=r[0]),r.attr(e.bindAttribute,e.getId()),e.applyBindingsToDescendants?t.applyBindingsToDescendants(n,i):t.applyBindings(n,i),e.setDisposeCallback(i)},bind:function(){var e=this,t=e.getTarget();e.isTargetBound()?console.info("target or bindTarget where not found, unable to render and bind the data",t):(e.hide(),e._renderHTML(),e._state="rendered",e.bindContent(),e.stopLoader(),e.show(),e.fireEvent("rendered",e))},render:function(){var e=this,t=e.getTarget();return t?(e.fireEvent("beforeRender",e),e.unbind(),e.bind(),e.initSubViews()):console.warn("unable to render, no target found for",e.target,this),e},setDisposeCallback:function(r){var i=this;t.utils.domNodeDisposal.addDisposeCallback(r,function(t){var r=n.getById(e(t).attr(i.bindAttribute));r.unbound()})},unbound:function(){var e=this,t=e.getStore();e._state="unbound",e.autoDestroy&&t&&(t.fireEvent("unbound",e),e.store=null),e.fireEvent("unbound",e)},show:function(){var e=this,t=e.getTarget();t&&t.show()},hide:function(){var e=this,t=e.getTarget();t&&t.hide()},isVisible:function(){var e=this,t=e.getTarget();return t?t.is(":visible"):!1},initStore:function(){var e=this;return e.store=e.store,e.store&&!e.store.isStore&&(e.store=n.createStore({data:e.store})),e},update:function(e){var t=this;return t.getStore().setData(e),t},startLoader:function(){var e=this,t=e.getTarget();t&&!e.loading&&(e.loading=!0,n.delay(function(){e.loading&&(e.hide(),t.before("<div id='fb-loader-"+e.getId()+"'>"+e.loadingTpl+"</div>"))},1))},stopLoader:function(){var t=this;t.loading&&(e("#fb-loader-"+t.getId()).remove(),t.show(),t.loading=!1)}}),n.define("Firebrick.controller.Base",{extend:"Firebrick.class.Base",init:function(){return this.callParent(arguments)},app:{on:function(){return n.events.on.apply(n.events,arguments)},listeners:function(){return n.events.addListener.apply(n.events,arguments)}}}),n.define("Firebrick.store.Base",{extend:"Firebrick.class.Base",init:function(){var e=this;return e.dataInitialised||(e.autoLoad?e.load():e.data&&e.setData(e.data)),e.autoDestroy&&e.on("unbound",function(){e.autoDestroy&&e.destroy()}),this.callParent(arguments)},dataType:"json",url:{get:null,submit:null},stringifyData:!0,loadProtocol:"GET",submitProtocol:"POST",status:"initial",isStore:!0,dataInitialised:!1,autoLoad:!1,data:null,_initialData:null,async:!0,root:null,getUrl:function(t){var n=this;return t?n.url[t]:e.isPlainObject(n.url)?n.url.get:n.url},load:function(e){return n.data.store._loadStore(this,e)},getData:function(){var t=this;return t.root&&e.isPlainObject(t.data)?e.isFunction(t.data[t.root])?t.data[t.root]():t.data[t.root]:t.data},destroy:function(){var e=this;return e.data=null,e.status="destroyed",n.classes.removeClass(e),e.callParent(arguments)},getRawData:function(n){var r=this;if(n)return r._initialData;var i=r.getData();return i=e.isFunction(i)?i():i,t.toJS(i)},setData:function(e){var n=this;return n.dataInitialised?t.mapping.isMapped(e)?console.error("cannot update store data using a mapped object",e):(n._initialData=e,t.mapping.fromJS(e,n.data)):(t.mapping.isMapped(e)||(n._initialData=e,typeof e=="string"?e=t.mapping.fromJSON(e):e=t.mapping.fromJS(e)),n.data=e,n.dataInitialised=!0),n},submit:function(){return n.data.store._submit(this)},toPlainObject:function(){var n=this;return e.isFunction(n.data)?t.toJs(n.data):e.isPlainObject(n.data)&&n.data.__ko_mapping__?t.mapping.toJS(n.data):n.data},toJson:function(){return JSON.stringify(this.toPlainObject())}}),window.Firebrick=n,window.fb=window.Firebrick,n});