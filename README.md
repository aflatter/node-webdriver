[![Build Status](https://secure.travis-ci.org/aflatter/node-webdriver.png?branch=master)](http://travis-ci.org/aflatter/node-webdriver)

A [webdriver](http://seleniumhq.org/projects/webdriver/) client implementation for [node](http://nodejs.org) with focus on a fluent API and clean error handling.

The canonical home of the project is on
[Github](https://github.com/aflatter/node-webdriver). Bugs and features can be discussed on the [Issues](https://github.com/aflatter/node-webdriver/issues) page.

The package is available via [npm](http://npmjs.org): `npm install webdriver`.

At the moment, there is no API documentation available. Please refer to
the source code instead.

# Example

    var webdriver = require('webdriver')
      , client, endpoint, opts;
   
    endpoint = webdriver.endpoint({host: 'localhost', port: 9515});

    endpoint.status(function(err, result) {
      console.log(result);
    });

    endpoint.session({browserName: 'chrome'}, function(err, session) {
      session.url('http://example.com', function(err) {
        var getLocation = function() {
          return window.location.href;
        };

        session.execute(getLocation, function(err, res) {
          assert.equal(res, 'http://example.com');
        });
      });
    });

# Hacking

To run the tests, use `npm install` and then `npm test`. To generate a
coverage report, use `npm run-script cov` - a HTML report will be made
available in `cover_html/`.

# License (MIT)

Copyright (c) 2012 Alexander Flatter

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
