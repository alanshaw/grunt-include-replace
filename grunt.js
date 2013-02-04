module.exports = function(grunt) {
	
	"use strict";
	
	grunt.initConfig({
		
		includereplace: {
			dist: {
				options: {
					globals: {
						test: 'Alan Test'
					}
				},
				src: 'test/files/test.html',
				dest: 'dist/'
			}
		},
		
		test: {
			files: ['test/**/*.js']
		},
		
		lint: {
			files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
		},
		
		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		},
		
		jshint: {
			options: {
				node: true,
				es5: true
			}
		}
	});
	
	grunt.loadTasks('tasks');
	
	grunt.registerTask('default', 'lint includereplace test');
};