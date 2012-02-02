var wd = require('webdriver');

wd.endpoint().session(function(err, session) {
  if (err) {
    throw err;
  }

  session.url('http://google.com', function(err) {
    var fn = function() { return window.location.href; }

    if (err) {
      throw err;
    }

    session.execute(fn, function(err, res) {
      if (err) {
        throw err;
      }

      console.log("Current location is: %s", res);

      session.quit(function() {
        if (err) {
          throw err;
        }

        console.log('Success!');
      });
    });
  });
});
