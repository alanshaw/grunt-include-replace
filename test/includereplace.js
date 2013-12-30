(function () {

	'use strict';

	var fs = require('fs');

	exports.suite = {
		test: function(test) {

			var expectations = [
				'cwd/index.html',
				'docroot/css/print.css',
				'docroot/css/style.css',
				'docroot/index.html',
				'docroot/pages/about.html',
				'exclusions/included.html',
				'globals/test.html',
				'in.html',
				'includes/test.txt',
				'lastMatch/index.html',
				'multisrc/js/script.js',
				'multisrc/lib/jquery.js',
				'multisrc/lib/underscore.js',
				'multisrcdest/css/main.css',
				'multisrcdest/css/normalize.css',
				'multisrcdest/html/index.html',
				'multisrcdest/js/main.js',
				'multisrcdest/js/vendor/jquery.js',
				'parameterless/test.txt',
				'parameters/test.html',
				'prefixsuffix/test.html',
				'regexp/index.html',
				'regexsafeprefixsuffix/index.js',
				'types/test.js',
				'copyFileToFile/index.production.html'
			];

			// Files not expected to exist after execution
			var unexpectations = [
				'docroot/inc/styles.html',
				'exclusions/excluded.js',
				'lastMatch/header.inc.html',
				'multisrc/js/inc/namespace.js'
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
