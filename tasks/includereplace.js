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
			suffix: '',
			globals: {}
		});
		
		// Variables available in ALL files
		var globalVars = options.globals;
		
		// Names of our variables
		var globalVarNames = Object.keys(globalVars);
		
		// Process lo-dash templates in global variables
		globalVarNames.forEach(function(globalVarName) {
			if(_.isString(globalVars[globalVarName])) {
				globalVars[globalVarName] = grunt.template.process(globalVars[globalVarName]);
			}
		});
		
		grunt.log.debug('Globals', globalVars);
		
		// Cached variable regular expressions
		var globalVarRegExps = {};
		
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
		
		var includeRegExp = new RegExp(options.prefix + 'include\\(["\'](.*?)["\']\\)' + options.suffix);
		var includeParamRegExp = new RegExp(options.prefix + 'include\\(["\'](.*?)["\'](, (.*?)){0,1}\\)' + options.suffix);
		
		function include(contents, workingDir) {
			
			var matches = includeParamRegExp.exec(contents);
			
			while(matches) {
				
				grunt.log.debug(matches);
				
				var match = matches[0];
				var includePath = matches[1];
				var localVars = JSON.parse(matches[2]);
				
				if(!grunt.file.isPathAbsolute(includePath)) {
					includePath = path.resolve(workingDir + path.sep + includePath);
				} else {
					includePath = path.resolve(includePath);
				}
				
				grunt.log.debug('Including', includePath);
				grunt.log.debug('Locals', localVars);
				
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
		
		// The file src globs
		var fileSrcs = this.file.src;
		
		// Allows file srcs to be a string
		if(_.isString(fileSrcs)) {
			fileSrcs = [fileSrcs];
		}
		
		// Destination directory
		var dest = this.file.dest;
		
		fileSrcs.forEach(function(fileSrc) {
			
			grunt.log.debug(fileSrc);
			
			var filePaths = grunt.file.expandFiles(fileSrc);
			
			grunt.log.debug(filePaths);
			
			filePaths.forEach(function(filePath) {
				
				grunt.log.debug('Processing ' + filePath);
				
				// Read file
				var contents = grunt.file.read(filePath);
				
				// Make replacements
				contents = replace(contents);
				
				// Process includes
				contents = include(contents, path.dirname(filePath));
				
				grunt.log.debug(contents);
				
				// Get the base dir, which we want to omit from our destination path
				var baseDir = path.dirname(fileSrc);
				
				while(_(baseDir).endsWith('**'))
					baseDir = path.dirname(baseDir);
				
				var savePath = path.normalize(dest + path.sep + filePath.replace(baseDir, ''));
				
				grunt.log.debug('Saving to', savePath);
				
				grunt.file.write(savePath, contents);
				
				grunt.log.ok('Processed ' + filePath);
			});
		});
	});
};
