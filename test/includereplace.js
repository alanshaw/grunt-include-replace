(function() {
	
	"use strict";
	
	var fs = require('fs');
	
	exports.suite = {
		test: function(test) {
			
			var expectations = [
				'globals/test.html',
				'includes/test.txt',
				'parameterless/test.txt',
				'parameters/test.html',
				'types/test.js',
				'prefixsuffix/test.html',
				'multisrc/lib/jquery.js',
				'multisrc/lib/underscore.js',
				'multisrc/js/script.js',
				'multisrcdest/css/main.css',
				'multisrcdest/css/normalize.css',
				'multisrcdest/html/index.html',
				'multisrcdest/js/main.js',
				'multisrcdest/js/vendor/jquery.js',
				'regexp/index.html',
				'in.html',
				'cwd/index.html',
				'exclusions/included.html',
				'docroot/index.html',
				'docroot/css/style.css',
				'docroot/css/print.css',
				'docroot/pages/about.html'
			];
			
			// Files not expected to exist after execution
			var unexpectations = [
				'multisrc/js/inc/namespace.js',
				'exclusions/excluded.js',
				'docroot/inc/styles.html'
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