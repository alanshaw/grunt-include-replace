grunt-include-replace [![Build Status](https://travis-ci.org/alanshaw/grunt-include-replace.png)](https://travis-ci.org/alanshaw/grunt-include-replace) [![Dependency Status](https://david-dm.org/alanshaw/grunt-include-replace.png)](https://david-dm.org/alanshaw/grunt-include-replace)
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

Install [Node.js](http://nodejs.org/) and [Grunt](http://gruntjs.com/).

Install grunt-include-replace:

	cd /path/to/your/project
	npm install grunt-include-replace

_Note: as of version 0.1.0 this plugin requires grunt 0.4. Install version 0.0.0-beta for grunt 0.3 support._

Then add this line to your project's `Gruntfile.js`:

```javascript
grunt.loadNpmTasks('grunt-include-replace');
```

Next, configure the task in your `Gruntfile.js`:

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

...or in "list" format:

```javascript
includereplace: {
	dist: {
		options: {
			globals: {foo: 'bar'}
		},
		files: {
			'dist/js': 'js/**/*.js',
			'dist/css': 'css/*.css'
		}
	}
}
```

Run the task by invoking `grunt includereplace`

WARNING: The task _does not_ check for recursive includes.
