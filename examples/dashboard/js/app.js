require.config({
	paths:{
		"jquery": "../bower_components/jquery/jquery",
		"popover": "../bower_components/bootstrap/js/popover",
		"tooltip": "../bower_components/bootstrap/js/tooltip",
		"knockout": "../bower_components/knockoutjs/dist/knockout",
		"knockout-mapping": "../bower_components/knockout-mapping/knockout.mapping",
		"firebrick": "../bower_components/firebrick/firebrick",
		"bootstrap": "../bower_components/bootstrap/dist/js/bootstrap.min",
		"typeahead": "../bower_components/typeahead.js/dist/typeahead.bundle.min",
		"jquery-minicolors": "../bower_components/jquery-minicolors/jquery.minicolors.min"
	},
	shim:{
		"popover": ["tooltip"],
		"knockout-mapping": ["knockout"],
		"bootstrap": ["jquery"],
		"typeahead": ["jquery"],
		"jquery-minicolors": ["jquery"]
	}
});


require(["knockout", "firebrick", "bootstrap", "jquery"], function(ko){
	
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
			helptext:helptext,
			user_result: ko.observableArray([])
		},
		lang:"/data/languages.json",
		require: ["controller/ViewController"],
		cache:false,
		dev: true,
		go:function(){
			//do your thing
		}
	});
	
	
});







