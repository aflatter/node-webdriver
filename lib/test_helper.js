var sinon = require('sinon'),
    misc  = require('./misc');

exports.mockClient = function() {
  var mock = {};
  exports.stubRequest(mock);
  misc.http.defineHelpers(mock);
  return mock;
};

exports.stubRequest = function(target) {
  target.request = sinon.spy(function() {
    target.lastRequest = {
        method: arguments[0]
      , resource: arguments[1]
      , params: arguments[2]
      , callback: arguments[3]
    };
  });
};
