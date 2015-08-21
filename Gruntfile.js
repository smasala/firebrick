/* globals module */
module.exports = function(grunt){
	'use strict';
	
	var pkg = require("./package.json"),
		tasks = [];

	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	
	
	grunt.initConfig({
		watch: {
		    firebrick: {
		        files: [ "./**/src/*.js"  ],
		        tasks: [ "shell:jscs", "shell:jshint" ]
		    },
	    },
		version: {
			readme:{
				options: {
					prefix: '#Firebrick JS version:\\s*'
				},
				src: ['readme.md']  
			},
			comments: {
				options: {
					prefix: '\\* @version\\s*'
				},
				src: ['src/*.js']
			},
			defaults:{
				src:['src/*.js', 'bower.json', 'yuidoc.json']
			}
		},
		shell: {
			jscs: {
		        command: "jscs -c .jscsrc ./src"
	        },
	        jshint: {
	        	 command: "jshint ./src"
	        },
			build: {
				command: [
				            'cd dist', 
				            'move configuration.js ../dp_tmp.js', 
				            'cd ..',
				            'cd tools',
				            'node r.js -o build.js',
				            'cd ..', 
				            'move dp_tmp.js dist/configuration.js',
				            'yuidoc --configfile yuidoc.json ./src',
				            'copy fb_small.png "docs/fb_small.png" /Y'
			            ].join('&&')
			}
		},
	});
	
	tasks = [
             'version', 
             'version:readme',
             'version:comments',
             'shell:jscs',
             'shell:jshint',
             'shell:build'
             ];
	
	grunt.registerTask('default', tasks);
};