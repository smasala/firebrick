/*!
 * Firebrick Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define(function(){
	"use strict";
	return require.config({
		paths:{
			"jquery": "../bower_components/jquery/dist/jquery",
			"knockout": "../bower_components/knockoutjs/dist/knockout.debug",
			"knockout-mapping": "../bower_components/knockout-mapping/knockout.mapping",
			"firebrick": "../bower_components/firebrick/src/firebrick"
		},
		shim:{
			"knockout-mapping": ["knockout"]
		}
	});	
});