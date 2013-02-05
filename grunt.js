module.exports = function(grunt) {
	
	"use strict";
	
	grunt.initConfig({
		
		includereplace: {
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
			}
			// TODO: Test me:
			// Path tests
			// vars in params
			// compact, full and list format
			// Multiline param
		},
		
		test: {
			files: ['test/*.js']
		},
		
		lint: {
			files: ['grunt.js', 'tasks/*.js', 'test/*.js']
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