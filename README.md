grunt-include-replace [![Build Status](https://travis-ci.org/alanshaw/grunt-include-replace.png)](https://travis-ci.org/alanshaw/grunt-include-replace) [![Dependency Status](http://david-dm.org/alanshaw/grunt-include-replace.png)](http://david-dm.org/alanshaw/grunt-include-replace)
=====================

Grunt task to include files and replace variables.

Allows for parameterised file includes:
 
hello.html

```html
<!DOCTYPE html>
<h1>Hello World!</h1>
<p>@@include('/path/to/include/message.html', {"name": "Joe Bloggs"})</p>
```

message.html

```html
Hello @@name!
```

Result:

```html
<!DOCTYPE html>
<h1>Hello World!</h1>
<p>Hello Joe Bloggs!</p>
```

Getting started
---------------

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-include-replace`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-include-replace');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/wiki/Getting-started

Next, configure the task in your `grunt.js` gruntfile:

```javascript
// Add this task to your grunt.initConfig call
includereplace: {
	dist: {
		options: {
			// Global variables available in all files
			globals: {
				var1: 'one',
				var2: 'two',
				var3: 'three'
			},
			// Optional variable prefix & suffix, defaults as shown
			prefix: '@@',
			suffix: ''
		},
		// Files to perform replacements and includes with
		src: '*.html',
		// Destinaion directory to copy files to
		dest: 'dist/'
	}
}
```

Run the task by invoking `grunt includereplace`

WARNING: The task _does not_ check for recursive includes.