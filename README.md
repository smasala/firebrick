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

* Load files in the correct order (Note: you can also require these files with requirejs)
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
