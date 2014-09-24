#Firebrick JS

JavaScript MVC Framework built with jQuery, Bootstrap and Rivets templates

## Install with Bower
```
bower install firebrick
```

##Usage

* Load jQuery and Rivets and Firebrick in the correct order
```
	<script src="bower_components/jquery/jquery.min.js" type="text/javascript"></script>
	<script src="bower_components/rivets/rivets.min.js" type="text/javascript"></script>
	
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
	<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css" />
	<script src="bower_components/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
	
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

## See it in Action

[Firebrick Todomvc](https://github.com/smasala/firebrick-todomvc)

