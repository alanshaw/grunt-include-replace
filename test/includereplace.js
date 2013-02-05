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
				'prefixsuffix/test.html'
			];
			
			test.expect(expectations.length);
			
			expectations.forEach(function(expectation) {
				test.equal(
					fs.readFileSync('test/expected/' + expectation, 'utf-8'),
					fs.readFileSync('dist/' + expectation, 'utf-8')
				);
			});
			
			test.done();
		}
	};
})();