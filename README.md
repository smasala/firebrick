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

###Manually

```
	<!-- jQuery -->
	<script src="bower_components/jquery/jquery.js" type="text/javascript"></script>

	<!-- Knockout JS -->
	<script src="bower_components/knockoutjs/dist/knockout.js" type="text/javascript"></script>
	<script src="bower_components/knockout-mapping/knockout.mapping.js" type="text/javascript"></script>
	
	<!-- Bootstrap -->
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
		<!-- Optional Bootrstrap Theme --> 
		<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css" />
	<script src="bower_components/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
	
	<!-- Firebrick JS -->
	<link rel="stylesheet" href="bower_components/firebrick/firebrick.css" />
	<script src="bower_components/firebrick/firebrick.js" type="text/javascript"></script>
	
	<!-- Require JS and App Start -- >
	<script data-main="js/app" src="bower_components/requirejs/require.js"></script>
```
* Create you application
```
	Firebrick.ready({
		app:{
			name:"MyApp",
			path:"/js"
		},
		go:function(){
			//Do your thing
		}
	});
```
