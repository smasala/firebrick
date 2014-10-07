#Firebrick JS v0.6.1

JavaScript MVC Framework built with:

* jQuery
* Bootstrap
* Knockout JS
* Require JS

## Install with Bower
```
bower install firebrick
```

##Demo

Checkout the [Dashboard ](http://demo.firebrickjs.com) demo

##Usage

###Require JS

```
	<!-- Bootstrap -->
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css" />
	
	<!-- Firebrick JS -->
	<link rel="stylesheet" href="bower_components/firebrick/firebrick.css" />

	<!-- Require JS and App Start -->
	<script data-main="js/app" src="bower_components/requirejs/require.js"></script>
```

* Create you application

```
	require.config({
		paths:{
			"jquery": "../bower_components/jquery/jquery",
			"knockout": "../bower_components/knockoutjs/dist/knockout",
			"knockout-mapping": "../bower_components/knockout-mapping/knockout.mapping",
			"firebrick": "../bower_components/firebrick/firebrick",
			"bootstrap": "../bower_components/bootstrap/dist/js/bootstrap.min",
		},
		shim:{
			"knockout-mapping": ["knockout"],
			"bootstrap": ["jquery"],
		}
	});

    require(["firebrick"], function(){
		Firebrick.ready({
			app:{
				name:"MyApp",
				path:"/js"
			},
			go:function(){
				//Do your thing
			}
		});
    });

```
