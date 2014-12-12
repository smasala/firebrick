/* globals module */
module.exports = function(grunt){
	"use strict";
	
	grunt.loadNpmTasks('grunt-version');
	
	grunt.initConfig({
	  version: {
		  defaults:{
			  src:["src/*.js", "bower.json", "yuidoc.json", "README.md"]
		  }
	  },
	});
	
	grunt.registerTask("default", ["version"]);
};