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
