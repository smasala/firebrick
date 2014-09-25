#Firebrick JS

JavaScript MVC Framework built with jQuery, Bootstrap and Knockout JS

## Install with Bower
```
bower install firebrick
```

##Usage

* Load jQuery, Bootstrap, Knockout JS and Firebrick in the correct order followed by
```
	<script src="bower_components/jquery/jquery.min.js" type="text/javascript"></script>
	<script src="bower_components/knockoutjs/dist/knockout.js" type="text/javascript"></script>
	<script src="bower_components/knockout-mapping/knockout.mapping.js" type="text/javascript"></script>
	
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css" />
	<script src="bower_components/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
	
	<link rel="stylesheet" href="bower_components/firebrick/firebrick.css" />
	<script src="bower_components/firebrick/firebrick.min.js" type="text/javascript"></script>
	
	<script src="js/app.js" type="text/javascript"></script>
```
* Create you application
```
	Firebrick.ready({
		app:{
			name:"MyApp",
			path:"/js"
		},
		go:function(){
			//Do you thing
		}
	});
```
