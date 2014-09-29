Firebrick.ready({
	app:{
		name:"MyApp",
		path:"js/"
	},
	require: ["controller/app/MainController"],
	cache:false,
	go:function(){
		require(["controller/ViewController"])
	}
});
