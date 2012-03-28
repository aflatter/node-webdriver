A webdriver client library for nodejs with focus on a fluent API and graceful error handling.

Getting started
===============

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

You might want to take a look at the examples directory.

To run the tests, use `npm install` and then `npm test`. To generate a
coverage report, use `npm run-script cov` - a HTML report will be made
available in `cover_html/`.
