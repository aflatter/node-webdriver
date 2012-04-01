/*global module exports*/
var chai   = require('chai')
  , wd     = require('webdriver')
  , assert = module.exports = chai.assert;

assert.oneRequest = function(client, opts) {
  assert.equal(client.callCount, 1, 'Only one request was made.');
  assert.request(client.lastRequest, opts);
};

assert.request = function(request, opts) {
  if (opts.method) {
    assert.equal(request.method, opts.method);
  }

  if (opts.params) {
    assert.deepEqual(request.params, opts.params);
  }

  if (opts.resource) {
    assert.equal(request.resource, opts.resource);
  }

  if (opts.callback) {
    assert.equal(request.callback, opts.callback);
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

