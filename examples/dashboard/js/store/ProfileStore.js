define(function(){
	return Firebrick.define("MyApp.store.ProfileStore", {
		extend:"Firebrick.store.Base",
		url:"/data/profile.json",
		root:"profile",
		autoLoad:true
	});
});