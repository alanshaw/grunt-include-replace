module.exports = function(grunt) {
	
	"use strict";
	
	grunt.initConfig({
		
		includereplace: {
			parameterless: {
				src: 'parameterless/test.txt',
				dest: 'dist/',
				expand: true,
				cwd: 'test/files/'
			},
			globals: {
				options: {
					globals: {
						var1: 'one',
						var2: 'two',
						var3: 'three'
					}
				},
				src: 'globals/test.html',
				dest: 'dist/',
				expand: true,
				cwd: 'test/files/'
			},
			parameters: {
				src: ['parameters/test.html'],
				dest: 'dist/',
				expand: true,
				cwd: 'test/files/'
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
				files: [
					{src: 'types/test.js', dest: 'dist/', expand: true, cwd: 'test/files/'}
				]
			},
			prefixsuffix: {
				options: {
					prefix: '<!-- @@',
					suffix: ' -->',
					globals: {
						x: 1138
					}
				},
				src: 'prefixsuffix/test.html',
				dest: 'dist/',
				expand: true,
				cwd: 'test/files/'
			},
			multisrc: {
				options: {
					prefix: '"@@',
					suffix: '"'
				},
				src: ['js/*.js', 'lib/**/*.js'],
				dest: 'dist/multisrc',
				expand: true,
				cwd: 'test/files/multisrc/'
			},
			multisrcdest: {
				options: {
					globals: {foo: 'bar'}
				},
				files: [
					{src: '**/*.js', dest: 'dist/multisrcdest/js', expand: true, cwd: 'test/files/multisrcdest/js'},
					{src: '**/*.html', dest: 'dist/multisrcdest/html', expand: true, cwd: 'test/files/multisrcdest/html'},
					{src: '**/*.css', dest: 'dist/multisrcdest/css', expand: true, cwd: 'test/files/multisrcdest/css'}
				]
			},
			regexp: {
				src: 'index.html',
				dest: 'dist/regexp/',
				expand: true,
				cwd: 'test/files/regexp/'
			},
			includesDir: {
				src: 'test.txt',
				dest: 'dist/includes/',
				expand: true,
				cwd: 'test/files/includes/',
				options : {
					//The base path where includes will be resolved
					includesDir : 'test/global_includes/'
				}
			},
			process: {
				options: {
					processIncludeContents: function(contents, localVars) {
						var indent = Array((parseInt(localVars.indent, 10)) + 1).join(" ");
						return contents.replace(/^/gm, indent);
					}
				},
				src: 'test.coffee',
				dest: 'dist/process/',
				expand: true,
				cwd: 'test/files/process/'
			},
			inhtml: {
				files: {
					'dist/': '*.html'
				}
			},
			cwd: {
				src: ['cwd/*'],
				dest: 'dist/',
				expand: true,
				cwd: 'test/files'
			},
			exclusions: {
				src: ['exclusions/*', '!exclusions/*.js'],
				dest: 'dist/',
				expand: true,
				cwd: 'test/files'
			},
			docroot: {
				options: {
					docroot: 'test/files/docroot/'
				},
				src: ['docroot/index.html', 'docroot/pages/*.html', 'docroot/**/*.css'],
				dest: 'dist/',
				expand: true,
				cwd: 'test/files'
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
				node: true
			},
			files: ['grunt.js', 'tasks/*.js', 'test/*.js']
		},
		
		clean: {
			dist: 'dist/*'
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadTasks('tasks');
	
	grunt.registerTask('default', ['jshint', 'includereplace', 'nodeunit']);
};