/*!
 * Firebrick Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define(function(){
	"use strict";
	var bowerPath = window._fbBowerPath || "../bower_components";
	return require.config({
		paths:{
			"jquery": bowerPath + "/jquery/dist/jquery",
			"knockout": bowerPath + "/knockoutjs/dist/knockout.debug",
			"knockout-mapping": bowerPath + "/knockout-mapping/knockout.mapping",
			"firebrick": bowerPath + "/firebrick/src/firebrick"
		},
		shim:{
			"knockout-mapping": ["knockout"]
		}
	});	
});