/*global suite test setup*/

var assert     = require('chai').assert
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
}); // Session
