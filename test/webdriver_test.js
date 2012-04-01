/*global suite test*/
var wd     = require('./lib')
  , assert = require('chai').assert
  ;

suite('webdriver', function() {
  suite('.endpoint()', function() {
    test('returns endpoint without arguments', function() {
      var result = wd.endpoint();

      assert.instanceOf(result, wd.Endpoint, 'returns an instance of Endpoint');
    });
  }); // endpoint
}); // webdriver
