/*global suite test setup*/

var assert     = require('chai').assert
  , spy        = require('sinon').spy
  , wd         = require('./lib')
  , Session    = wd.Session
  , ClientMock = wd.ClientMock;

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

suite('Session', function() {
  var id   = 1
    , session, client;

  setup(function() {
    client = new ClientMock();
  });

  suite('constructor', function() {
    var caps = {};

    test('making a new instance using .create()', function() {
      session = Session.create({id: id, client: client, capabilities: caps});

      assert.equal(session.id,           id,     'id is set on the instance');
      assert.equal(session.client,       client, 'client is set on the instance');
      assert.equal(session.capabilities, caps,   'capabilities is set on the instance');

      assert.instanceOf(session, Session);
    });

    test('making a new instance using the new keyword', function() {
      session = new Session({id: id, client: client, capabilities: caps});

      assert.equal(session.id,           id,     'id is set on the instance');
      assert.equal(session.client,       client, 'client is set on the instance');
      assert.equal(session.capabilities, caps,   'capabilities is set on the instance');

      assert.instanceOf(session, Session);
    });
  }); // constructor

  suite('request', function() {
    var method   = 'GET'
      , resource = '/foo'
      , params   = null
      , callback = function() {}
      , request;

    test('scopes all paths to the session', function() {
      session = Session.create({id: id, client: client});
      session.request(method, resource, params, callback);

      assert.equal(client.callCount, 1, 'client receives one request');

      request = client.lastRequest;
      assert.equal(request.method,   method,                      'method is not modified');
      assert.equal(request.resource, '/session/' + id + resource, 'resource is scoped');
      assert.equal(request.params,   params,                      'params are not modified');
      assert.equal(request.callback, callback,                    'callback is not modified');
    });
  }); // request

  suite('url', function() {
    var callback = function() {}
      , request;

    test('retrieves url when called without string', function() {
      session = Session.create({id: 1, client: client});
      session.url(callback);

      assert.oneRequest(client, {
          method: 'GET'
        , resource: '/session/' + id + '/url'
        , params: null
        , callback: callback
      });
    });

    test('navigates to url when called with a string', function() {
      var url = 'http://example.com';

      session = Session.create({id: 1, client: client});
      session.url(url, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/url'
        , params: {url: url}
        , callback: callback
      });
    });
  }); // url
  suite('element', function() {
    var request
      , callback
      , strategy
      , value
      , elementId
      , err
      , result;

    setup(function() {
      strategy  = 'css';
      value     = '#foo';
      elementId = 'wd-el-id';
      callback  = spy();
    });

    test('searches for an element and returns result', function() {
      session = Session.create({id: 1, client: client});
      session.element(strategy, value, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/element'
        , params: {using: strategy, value: value}
      });

      request = client.lastRequest;

      /** Simulate a valid response. */
      request.callback.apply(null, [null, {value: {ELEMENT: elementId}}]);

      assert.ok(callback.calledOnce);

      err    = callback.lastCall.args[0];
      result = callback.lastCall.args[1];

      assert.isNull(err, 'callback is called without an error');
      assert.element(result, session, elementId);
    });

    test('passes error to the callback if something goes wrong', function() {
      err = 'Something went wrong.';

      session = Session.create({id: 1, client: client});
      session.element(strategy, value, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/element'
        , params: {using: strategy, value: value}
      });

      request = client.lastRequest;

      /** Simulate an invalid response. */
      request.callback.apply(null, [err]);

      assert.ok(callback.calledOnce);

      err    = callback.lastCall.args[0];
      result = callback.lastCall.args[1];

      assert.calledWithError(err, callback.lastCall);
    });
  }); // element

  suite('elements', function() {
    var request
      , callback
      , strategy
      , value
      , elementIds
      , err
      , result;

    setup(function() {
      strategy   = 'css';
      value      = '.bar';
      elementIds = ['el-1', 'el-2'];
      callback   = spy();
    });

    test('searches for multiple elements and returns them', function() {
      session = Session.create({id: 1, client: client});
      session.elements(strategy, value, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/elements'
        , params: {using: strategy, value: value}
      });

      request = client.lastRequest;

      /** Simulate a valid response. */
      request.callback.apply(null, [null, {value: [{ELEMENT: elementIds[0]}, {ELEMENT: elementIds[1]}]}]);

      assert.ok(callback.calledOnce);

      err    = callback.lastCall.args[0];
      result = callback.lastCall.args[1];

      assert.isNull(err, 'callback is called without an error');
      assert.instanceOf(result, Array, 'result is an Array');

      assert.element(result[0], session, elementIds[0]);
      assert.element(result[1], session, elementIds[1]);
    });

    test('passes error to the callback if something goes wrong', function() {
      err = 'Something went wrong.';

      session = Session.create({id: 1, client: client});
      session.elements(strategy, value, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/elements'
        , params: {using: strategy, value: value}
      });

      request = client.lastRequest;

      /** Simulate an invalid response. */
      request.callback.apply(null, [err]);

      assert.ok(callback.calledOnce);

      err    = callback.lastCall.args[0];
      result = callback.lastCall.args[1];

      assert.calledWithError(err, callback.lastCall);
    });
  }); // elements
  suite('timeout', function() {
    test('attempts to set the timeout to the passed value', function() {
      var name     = 'a_timeout'
        , ms       = 1337
        , callback = function() {};

      session = Session.create({id: 1, client: client});
      session.timeout(name, ms, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/timeouts/' + name
        , params: {ms: ms}
        , callback: callback
      });
    });
  }); // timeout
  suite('quit', function() {
    test('quits the browser', function() {
      var callback = function() {};

      session = Session.create({id: 1, client: client});
      session.quit(callback);

      assert.oneRequest(client, {
          method: 'DELETE'
        , resource: '/session/' + id
        , callback: callback
      });
    });
  }); // quit
}); // Session
