define(function(){
	return Firebrick.create("MyApp.store.UserStore", {
		extend:"Firebrick.store.Base",
		url:"/data/users.json",
		autoLoad:true
	});
});