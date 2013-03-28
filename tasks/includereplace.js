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
			globals: {}
		});
		
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
		
		grunt.log.debug('Globals', globalVars);
		
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
				
				matches = includeRegExp.exec(contents);
			}
			
			return contents;
		}
		
		this.files.forEach(function(srcDest) {
			
			srcDest.orig.src.forEach(function(origSrc) {
				
				grunt.log.debug('Processing glob ' + origSrc);
				
				// Get the base dir, which we want to omit from our destination path
				var baseDir = path.dirname(origSrc);
				
				while(_(baseDir).endsWith('**'))
					baseDir = path.dirname(baseDir);
				
				grunt.log.debug('Base dir ' + baseDir);
				
				grunt.file.expand(origSrc).forEach(function(src) {
					
					if(!grunt.file.isFile(src)) return;
					
					grunt.log.debug('Processing ' + src);
					
					// Read file
					var contents = grunt.file.read(src);
					
					// Make replacements
					contents = replace(contents);
					
					// Process includes
					contents = include(contents, path.dirname(src));
					
					grunt.log.debug(contents);
					
					var dest = path.normalize(srcDest.dest + path.sep + src.replace(baseDir, ''));
					
					grunt.log.debug('Saving to', dest);
					
					grunt.file.write(dest, contents);
					
					grunt.log.ok('Processed ' + src);
				});
			});
		});
	});
};
