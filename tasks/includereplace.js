/*
 * grunt-include-replace
 * https://github.com/alanshaw/grunt-include-replace
 *
 * Copyright (c) 2013 Alan Shaw
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	
	"use strict";
	
	var _ = grunt.util._;
	
	var path = require('path');
	var fs = require('fs');
	
	grunt.registerMultiTask('includereplace', 'Include files and replace variables', function() {
		
		var options = this.options({
			prefix: '@@',
			suffix: '',
			globals: {},
			includesDir: '',
			docroot: '.'
		});
		
		grunt.log.debug('Options', options);
		
		// Variables available in ALL files
		var globalVars = options.globals;
		
		// Names of our variables
		var globalVarNames = Object.keys(globalVars);
		
		globalVarNames.forEach(function(globalVarName) {
			if(_.isString(globalVars[globalVarName])) {
				globalVars[globalVarName] = globalVars[globalVarName];
			} else {
				globalVars[globalVarName] = JSON.stringify(globalVars[globalVarName]);
			}
		});
		
		// Cached variable regular expressions
		var globalVarRegExps = {};
		
		function replace(contents, localVars) {
			
			localVars = localVars || {};
			
			var varNames = Object.keys(localVars);
			var varRegExps = {};
			
			// Replace local vars
			varNames.forEach(function(varName) {
				
				// Process lo-dash templates (for strings) in global variables and JSON.stringify the rest
				if(_.isString(localVars[varName])) {
					localVars[varName] = grunt.template.process(localVars[varName]);
				} else {
					localVars[varName] = JSON.stringify(localVars[varName]);
				}
				
				varRegExps[varName] = varRegExps[varName] || new RegExp(options.prefix + varName + options.suffix, 'g');
				
				contents = contents.replace(varRegExps[varName], localVars[varName]);
			});
			
			// Replace global variables
			globalVarNames.forEach(function(globalVarName) {
				
				globalVarRegExps[globalVarName] = globalVarRegExps[globalVarName] || new RegExp(options.prefix + globalVarName + options.suffix, 'g');
				
				contents = contents.replace(globalVarRegExps[globalVarName], globalVars[globalVarName]);
			});
			
			return contents;
		}
		
		var includeRegExp = new RegExp(options.prefix + 'include\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)' + options.suffix);
		
		function include(contents, workingDir) {
			
			var matches = includeRegExp.exec(contents);
			
			while(matches) {
				
				var match = matches[0];
				var includePath = matches[1];
				var localVars = matches[3] ? JSON.parse(matches[3]) : {};
				
				if(!grunt.file.isPathAbsolute(includePath)) {
					includePath = path.resolve(path.join((options.includesDir ? options.includesDir : workingDir), includePath));
				} else {
					if (options.includesDir) {
						grunt.log.error('includesDir works only with relative paths. Could not apply includesDir to ' + includePath);
					}
					includePath = path.resolve(includePath);
				}
				
				var docroot = path.relative(path.dirname(includePath), path.resolve(options.docroot));
				
				// Set docroot as local var but don't overwrite if the user has specified
				if (localVars.docroot === undefined) {
					localVars.docroot = docroot ? docroot + '/' : '';
				}
				
				grunt.log.debug('Including', includePath);
				grunt.log.debug('Locals', localVars);
				
				var includeContents = grunt.file.read(includePath);
				
				// Make replacements
				includeContents = replace(includeContents, localVars);
				
				// Process includes
				includeContents = include(includeContents, path.dirname(includePath));
				if (options.processIncludeContents && typeof options.processIncludeContents === 'function') {
					includeContents = options.processIncludeContents(includeContents, localVars);
				}
				
				contents = contents.replace(match, includeContents);
				
				matches = includeRegExp.exec(contents);
			}
			
			return contents;
		}
		
		this.files.forEach(function(config) {
			
			config.src.forEach(function(src) {
				
				grunt.log.debug('Processing glob ' + src);
				
				if(!grunt.file.isFile(src)) return;
				
				grunt.log.debug('Processing ' + src);
				
				// Read file
				var contents = grunt.file.read(src);
				
				var docroot = path.relative(path.dirname(src), path.resolve(options.docroot));
				var localVars = {docroot: docroot ? docroot + '/' : ''};
				
				grunt.log.debug('Locals', localVars);
				
				// Make replacements
				contents = replace(contents, localVars);
				
				// Process includes
				contents = include(contents, path.dirname(src));
				
				//grunt.log.debug(contents);
				
				var dest = config.dest;
				
				if(!config.orig.cwd) {
					dest = path.join(dest, src);
				}
				
				grunt.log.debug('Saving to', dest);
				
				grunt.file.write(dest, contents);
				
				grunt.log.ok('Processed ' + src);
			});
		});
	});
};
