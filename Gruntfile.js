module.exports = function(grunt) {
	
	"use strict";
	
	grunt.initConfig({
		
		includereplace: {
			everything: {
				src: 'test/files/**/*.html',
				dest: 'dist/everything/'
			},
			parameterless: {
				src: 'test/files/parameterless/test.txt',
				dest: 'dist/parameterless/'
			},
			globals: {
				options: {
					globals: {
						var1: 'one',
						var2: 'two',
						var3: 'three'
					}
				},
				src: 'test/files/globals/test.html',
				dest: 'dist/globals'
			},
			parameters: {
				src: ['test/files/parameters/test.html'],
				dest: 'dist/parameters'
			},
			types: {
				options: {
					globals: {
						'int': 138,
						'float': 11.38,
						'array': ['foo', "bar", 138, 1.138, {foo: 'bar', bar: 138, baz: [1, 3, 8]}],
						'object': {
							a: 'aaa',
							b: 138,
							c: 'ccc'
						},
						'string': 'onethirtyeight'
					}
				},
				src: 'test/files/types/test.js',
				dest: 'dist/types/'
			},
			prefixsuffix: {
				options: {
					prefix: '<!-- @@',
					suffix: ' -->',
					globals: {
						x: 1138
					}
				},
				src: 'test/files/prefixsuffix/test.html',
				dest: 'dist/prefixsuffix/'
			},
			multisrc: {
				options: {
					prefix: '"@@',
					suffix: '"'
				},
				src: ['test/files/multisrc/js/*.js', 'test/files/multisrc/lib/**/*.js'],
				dest: 'dist/multisrc/scripts'
			},
			multisrcdest: {
				options: {
					globals: {foo: 'bar'}
				},
				files: {
					'dist/multisrcdest/js': 'test/files/multisrcdest/js/**/*.js',
					'dist/multisrcdest/html': 'test/files/multisrcdest/html/*.html',
					'dist/multisrcdest/css': 'test/files/multisrcdest/css/*.css'
				}
			},
			regexp: {
				src: 'test/files/regexp/index.html',
				dest: 'dist/regexp/'
			}
			// TODO: Test me:
			// lodash templates in global and local vars
			// vars in params
			// Multiline param
		},
		
		nodeunit: {
			files: ['test/*.js']
		},
		
		jshint: {
			options: {
				node: true,
				es5: true
			},
			files: ['grunt.js', 'tasks/*.js', 'test/*.js']
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadTasks('tasks');
	
	grunt.registerTask('default', ['jshint', 'includereplace', 'nodeunit']);
};