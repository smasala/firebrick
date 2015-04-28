#Firebrick JS version: 0.11.0

JavaScript MVC Framework built with:

* jQuery 2
* Knockout JS 3
* Require JS 2

## Install with Bower
```
bower install firebrick
```

##Demo

Checkout the [Dashboard ](http://demo.firebrickjs.com) demo

##Usage

###Require JS

```
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
			"firebrick": "../bower_components/firebrick/firebrick"
		},
		shim:{
			"knockout-mapping": ["knockout"]
		}
	});

    require(["firebrick"], function(){
		Firebrick.ready({
			app:{
				name:"MyApp",
				path:"js/"
			},
			go:function(){
				//Do your thing
			}
		});
    });

```
