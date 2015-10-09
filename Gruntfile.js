/* globals module */
module.exports = function(grunt){
	"use strict";
	
	var tasks = [];

	grunt.loadNpmTasks("grunt-version");
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-jscs" );
	
	
	grunt.initConfig({
		watch: {
		    firebrick: {
		        files: [ "./**/src/*.js"  ],
		        tasks: [ "shell:jscs", "shell:jshint" ]
		    },
	    },
	    jasmine: {
	        src: "src/client/js/*.js",
	        options: {
	          specs: "specs/client/*Spec.js"
	        }
	    },
		version: {
			readme:{
				options: {
					prefix: "#Firebrick JS version:\\s*"
				},
				src: ["readme.md"]  
			},
			comments: {
				options: {
					prefix: "\\* @version\\s*"
				},
				src: ["src/*.js"]
			},
			defaults:{
				src:["src/*.js", "bower.json", "yuidoc.json"]
			}
		},
		jscs: {
            src: "./src/**/*.js",
            options: {
                config: ".jscsrc"
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require( "jshint-stylish" )
            },
            all: {
                src: [ "Gruntfile.js", "./src{,*/}*.js" ]
            }
        },
		shell: {
			build: {
				command: [
				            "cd dist", 
				            "move configuration.js ../dp_tmp.js", 
				            "cd ..",
				            "cd tools",
				            "node r.js -o build.js",
				            "cd ..", 
				            "move dp_tmp.js dist/configuration.js",
				            "yuidoc --configfile yuidoc.json ./src",
				            "copy fb_small.png \"docs/fb_small.png\" /Y"
			            ].join("&&")
			}
		},
	});
	
	tasks = [
             "version", 
             "version:readme",
             "version:comments",
             "jscs",
             "jshint",
             "shell:build"
             ];
	
	grunt.registerTask("dev", ["jscs", "jshint"]);
	grunt.registerTask("travis", ["jscs", "jshint"]);
	grunt.registerTask("default", tasks);
};