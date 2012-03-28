/*global suite test setup*/

var assert     = require('chai').assert
  , spy        = require('sinon').spy
  , wd         = require('./lib')
  , Session    = wd.Session
  , ClientMock = wd.ClientMock;

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

      assert.equal(client.callCount, 1, 'client receives one request');

      request = client.lastRequest;
      assert.equal(request.method,   'GET',                     'method is not modified');
      assert.equal(request.resource, '/session/' + id + '/url', 'resource is scoped');
      assert.equal(request.params,   null,                      'params are not defined');
      assert.equal(request.callback, callback,                  'callback is passed');
    });

    test('navigates to url when called with a string', function() {
      var url = 'http://example.com';

      session = Session.create({id: 1, client: client});
      session.url(url, callback);

      assert.equal(client.callCount, 1, 'client receives one request');

      request = client.lastRequest;
      assert.equal(request.method,     'POST',                    'method is not modified');
      assert.equal(request.resource,   '/session/' + id + '/url', 'resource is scoped');
      assert.deepEqual(request.params, {url: url},                'params includes url');
      assert.equal(request.callback,   callback,                  'callback is passed');
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

      assert.equal(client.callCount, 1, 'client receives one request');

      request = client.lastRequest;
      assert.equal(request.method,    'POST', 'uses POST method');
      assert.equal(request.resource, '/session/' + id + '/element', 'resource is scoped');
      assert.deepEqual(request.params, {using: strategy, value: value});

      /** Simulate a valid response. */
      request.callback.apply(null, [null, {value: {ELEMENT: elementId}}]);

      assert.ok(callback.calledOnce);

      err     = callback.lastCall.args[0];
      result = callback.lastCall.args[1];

      assert.isNull(err, 'callback is called without an error');
      assert.instanceOf(result,    wd.Element, 'result is an Element');
      assert.equal(result.id,      elementId,  'element id is read from the response');
      assert.equal(result.session, session,    'the session passes itself');
    });

    test('passes error to the callback if something goes wrong', function() {
      err = 'Something went wrong.';

      session = Session.create({id: 1, client: client});
      session.element(strategy, value, callback);

      assert.equal(client.callCount, 1, 'client receives one request');

      request = client.lastRequest;
      assert.equal(request.method,    'POST', 'uses POST method');
      assert.equal(request.resource, '/session/' + id + '/element', 'resource is scoped');
      assert.deepEqual(request.params, {using: strategy, value: value});

      /** Simulate an invalid response. */
      request.callback.apply(null, [err]);

      assert.ok(callback.calledOnce);

      err     = callback.lastCall.args[0];
      result = callback.lastCall.args[1];

      assert.equal(callback.lastCall.args[0], err, 'error is passed to the callback');
      assert.isNull(callback.lastCall.args[1], 'callback does not receive a result');
    });
  }); // element
}); // Session
