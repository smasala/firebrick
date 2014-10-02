require.config({
	paths:{
		"popover": "../bower_components/bootstrap/js/popover",
		"tooltip": "../bower_components/bootstrap/js/tooltip"
	},
	shim:{
		"popover":{
			deps:["tooltip"]
		}
	}
});

var helptext = "<p class='text-center'><img class='text-center' src='/images/help.png'>" +
				"<br>" +
				"Help, I need somebody" +
				"<br>" +
				"Help, not just anybody" +
				"<br>" +
				"Help, you know I need someone, help" +
				"<br><br>" +
				"When I was younger (So much younger than) so much younger than today" +
				"<br>" +
				"(I never needed) I never needed anybody's help in any way" +
				"<br" +
				"(Now) But now these days are gone (These days are gone), I'm not so self assured" +
				"<br>" +
				"(I know I've found) Now I find I've changed my mind and opened up the doors</p>";


Firebrick.ready({
	app:{
		name:"MyApp",
		path:"js/"
	},
	viewData:{
		helptext:helptext
	},
	lang:"../data/languages.json",
	require: ["controller/ViewController"],
	cache:false,
	go:function(){
		//do your thing
	}
});



