var assert  = require('chai').assert
   ,spy     = require('sinon').spy
  , Session = require('webdriver/lib/session');

var fakeClient = function() {
  return {request: spy()};
};

suite('Session', function() {
  var id     = 1
    , client = {}
    , caps   = {};

  suite('constructor', function() {
    test('making a new instance using .create()', function() {
      var session = Session.create({id: id, client: client, capabilities: caps});

      assert.equal(session.id,           id,     'id is set on the instance');
      assert.equal(session.client,       client, 'client is set on the instance');
      assert.equal(session.capabilities, caps,   'capabilities is set on the instance');

      assert.instanceOf(session, Session);
    });

    test('making a new instance using the new keyword', function() {
      var session = new Session({id: id, client: client, capabilities: caps});

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
      , callback = function() {};

    test('scopes all paths to the session', function() {
      var request  = spy()
        , client   = {request: request}
        , session  = Session.create({id: id, client: client})
        , args;

      session.request(method, resource, params, callback);
      assert.ok(request.calledOnce, 'client receives one request');

      args = request.getCall(0).args;
      assert.equal(args[0], method,                      'method is not modified');
      assert.equal(args[1], '/session/' + id + resource, 'resource is scoped');
      assert.equal(args[2], params,                      'params are not modified');
      assert.equal(args[3], callback,                    'callback is not modified');
    });
  }); // request
  suite('url', function() {
    test('retrieves url when called without string', function() {
      var client   = fakeClient()
        , session  = Session.create({id: 1, client: client})
        , callback = spy()
        , args;

      session.url(callback);

      assert.ok(client.request.calledOnce, 'client receives one request');

      args = client.request.getCall(0).args;
      assert.equal(args[0], 'get',                       'method is not modified');
      assert.equal(args[1], '/session/' + id + '/url',   'resource is scoped');
      assert.equal(args[2], null,                        'params are not defined');
      assert.equal(args[3], callback,                    'callback is passed');
    });
    test('navigates to url when called with a string', function() {
      var client   = fakeClient()
        , session  = Session.create({id: 1, client: client})
        , callback = spy()
        , url      = 'http://example.com'
        , args;

      session.url(url, callback);

      assert.ok(client.request.calledOnce, 'client receives one request');

      args = client.request.getCall(0).args;
      assert.equal(args[0], 'post',                      'method is not modified');
      assert.equal(args[1], '/session/' + id + '/url',   'resource is scoped');
      assert.deepEqual(args[2], {url: url},              'params includes url');
      assert.equal(args[3], callback,                    'callback is passed');
    });
  }); // url
}); // Session
