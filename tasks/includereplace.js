/*
 * grunt-include-replace
 * https://github.com/alanshaw/grunt-include-replace
 *
 * Copyright (c) 2013 Alan Shaw
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	
	"use strict";
	
	var _ = grunt.utils._;
	
	var path = require('path');
	var fs = require('fs');
	
	grunt.registerMultiTask('includereplace', 'Include files and replace variables', function() {
		
		var options = this.data.options || {};
		
		_.defaults(options, {
			prefix: '@@',
			variables: {}
		});
		
		// Variables available in ALL files
		var globalVars = options.variables;
		
		// Names of our variables
		var globalVarNames = Object.keys(globalVars);
		
		// Cached variable regular expressions
		var globalVarRegExps = {};
		
		// The files to process
		var filePaths = grunt.file.expandFiles(this.file.src);
		
		// Destination directory
		var dest = this.file.dest;
		
		function replace(contents, localVars) {
			
			localVars = localVars || {};
			
			var varNames = Object.keys(localVars);
			var varRegExps = {};
			
			// Replace local vars
			varNames.forEach(function(varName) {
				
				varRegExps[varName] = varRegExps[varName] || new RegExp(options.prefix + varName, 'g');
				
				contents = contents.replace(varRegExps[varName], localVars[varName]);
			});
			
			// Replace global variables
			globalVarNames.forEach(function(globalVarName) {
				
				globalVarRegExps[globalVarName] = globalVarRegExps[globalVarName] || new RegExp(options.prefix + globalVarName, 'g');
				
				contents = contents.replace(globalVarRegExps[globalVarName], globalVars[globalVarName]);
			});
			
			return contents;
		}
		
		var includeRegExp = new RegExp(options.prefix + 'include\\(["\'](.*?)["\']\\)');
		var includeParamRegExp = new RegExp(options.prefix + 'include\\(["\'](.*?)["\'], (.*?)\\)');
		
		function include(contents, workingDir) {
			
			var matches = includeParamRegExp.exec(contents);
			
			while(matches) {
				
				var match = matches[0];
				var includePath = matches[1];
				var localVars= JSON.parse(matches[2]);
				
				if(!grunt.file.isPathAbsolute(includePath)) {
					includePath = path.resolve(workingDir + path.sep + includePath);
				} else {
					includePath = path.resolve(includePath);
				}
				
				grunt.log.debug('Including', includePath);
				grunt.log.debug('Locals', matches[2]);
				
				var includeContents = grunt.file.read(includePath);
				
				// Make replacements
				includeContents = replace(includeContents, localVars);
				
				// Process includes
				includeContents = include(includeContents, path.dirname(includePath));
				
				contents = contents.replace(match, includeContents);
				
				matches = includeParamRegExp.exec(contents);
			}
			
			return contents;
		}
		
		filePaths.forEach(function(filePath) {
			
			grunt.log.debug('Processing ' + filePath);
			
			// Read file
			var contents = grunt.file.read(filePath);
			
			// Make replacements
			contents = replace(contents);
			
			// Process includes
			contents = include(contents, path.dirname(filePath));
			
			grunt.log.debug(contents);
			
			//grunt.file.write(dest, contents);
			
			grunt.log.ok('Processed ' + filePath);
		});
	});
};
