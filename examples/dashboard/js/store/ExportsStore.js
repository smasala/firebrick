define(function(){
	return Firebrick.define("MyApp.store.ExportsStore", {
		extend:"Firebrick.store.Base",
		url:"/data/exports.json",
		autoLoad:true
	});
});