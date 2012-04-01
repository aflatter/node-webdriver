/*global module exports*/
var chai   = require('chai')
  , wd     = require('./webdriver')
  , assert = module.exports = chai.assert;

assert.oneRequest = function(obj, expected) {
  var args, actual;

  assert.ok(obj.request.calledOnce, 'request method is called once');

  args   = obj.request.lastCall.args;
  actual = {method: args[0], resource: args[1], params: args[2], callback: args[3]};

  assert.request(actual, expected);
};

assert.request = function(request, expected) {
  if (expected.method) {
    assert.equal(request.method, expected.method);
  }

  if (expected.params) {
    assert.deepEqual(request.params, expected.params);
  }

  if (expected.resource) {
    assert.equal(request.resource, expected.resource);
  }

  if (expected.callback) {
    assert.equal(request.callback, expected.callback);
  }
};

assert.calledWithError = function(err, call) {
  assert.equal(call.args[0], err, 'error is passed to the callback');
  assert.isNull(call.args[1], 'callback does not receive a result');
};

assert.element = function(actual, session, id) {
  assert.instanceOf(actual,    wd.Element, 'result is an Element');
  assert.equal(actual.id,      id,         'element id is read from the response');
  assert.equal(actual.session, session,    'the session passes itself');
};
