(function() {
	
	"use strict";
	
	var fs = require('fs');
	
	exports.suite = {
		test: function(test) {
			
			var expectations = [
				'globals/test.html',
				'parameterless/test.txt',
				'parameters/test.html',
				'types/test.js',
				'prefixsuffix/test.html',
				'multisrc/scripts/jquery.js',
				'multisrc/scripts/script.js',
				'multisrc/scripts/underscore.js',
				'multisrcdest/css/main.css',
				'multisrcdest/css/normalize.css',
				'multisrcdest/html/index.html',
				'multisrcdest/js/main.js',
				'multisrcdest/js/vendor/jquery.js',
				'regexp/index.html'
			];
			
			// Files not expected to exist after execution
			var unexpectations = [
				'multisrc/scripts/inc/namespace.js'
			];
			
			test.expect(expectations.length + unexpectations.length);
			
			expectations.forEach(function(expectation) {
				test.equal(
					fs.readFileSync('test/expected/' + expectation, 'utf-8'),
					fs.readFileSync('dist/' + expectation, 'utf-8')
				);
			});
			
			unexpectations.forEach(function(unexpectation) {
				test.strictEqual(false, fs.existsSync('dist/' + unexpectation));
			});
			
			test.done();
		}
	};
})();