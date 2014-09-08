#Firebrick JS

JavaScript MVC Framework built with jQuery and Rivets templating

##Usage

* Load jQuery and Rivets and Firebrick in the correct order
```
	<script src="jquery.js"></script>
	<script src="rivet.js"></script>
	<script src="firebrick.js"></script>
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

