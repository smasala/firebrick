/* globals module */
module.exports = function(grunt){
	'use strict';
	
	var pkg = require("./package.json"),
		githubDir = pkg.githubPath,
		gitHubPagesDir = githubDir + ".pages",
		tasks = [];

	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	
	/**
	 * until 0.5
	 */
	var previous_force_state = grunt.option("force");

	grunt.registerTask("force",function(set){
	    if (set === "on") {
	        grunt.option("force",true);
	    }
	    else if (set === "off") {
	        grunt.option("force",false);
	    }
	    else if (set === "restore") {
	        grunt.option("force",previous_force_state);
	    }
	});
	/*************************/
	
	grunt.initConfig({
		version: {
			readme:{
				options: {
					prefix: '#Firebrick JS version:\\s*'
				},
				src: ['readme.md']  
			},
			  defaults:{
				  src:['src/*.js', 'bower.json', 'yuidoc.json']
			  }
		},
		shell: {
			batch: {
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
		clean:{
			pre_github:[githubDir + "/*", "!"+githubDir+"/.*", "!"+githubDir+"/.*/**"],
			pre_github_pages:[gitHubPagesDir + "/docs/**"],
		},
		copy:{
			github: {
				files:[
				       {expand: true, src: ["./**", 
		                                "!./.*", 
		                                "!./.*/**", 
		                                "!./npm-debug.log", 
		                                "!./node_modules/**",
		                                "!./Gruntfile.js",
		                                "!./package.json"], dest: githubDir
				       }
		       ]
			},
			github_pages: {
				files:[
			       {expand: true, src: ["./docs/**"], dest: gitHubPagesDir}
			       ]
			}
		}
	});
	
	tasks = [
             'version', 
             'version:readme', 
             'shell:batch'
             ];
	
	if(githubDir){
		tasks = tasks.concat([
		     'force:on', 
             'clean:pre_github', 
             'copy:github', 
             'clean:pre_github_pages', 
             'copy:github_pages', 
     		'force:restore'
         ]);
	}
	
	grunt.registerTask('default', tasks);
};