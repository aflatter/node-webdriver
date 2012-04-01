/*global suite test setup*/

var spy        = require('sinon').spy
  , wd         = require('./lib')
  , assert     = wd.assert
  , Session    = wd.Session
  , TestHelper = wd.TestHelper;

suite('Session', function() {
  var id   = 1
    , session, client;

  setup(function() {
    id      = 1;
    client  = TestHelper.mockClient();
    session = Session.create({id: id, client: client});
  });

  suite('constructor', function() {
    var caps = {},
        opts;

    setup(function() {
      opts = {id: id, client: client, capabilities: caps};
    });

    function matches(session) {
      assert.equal(session.id,           id,     'id is set on the instance');
      assert.equal(session.client,       client, 'client is set on the instance');
      assert.equal(session.capabilities, caps,   'capabilities is set on the instance');

      assert.instanceOf(session, Session);
    }

    test('making a new instance using .create()', function() {
      matches(Session.create(opts));
    });

    test('making a new instance using the new keyword', function() {
      matches(new Session(opts));
    });
  }); // constructor

  suite('request', function() {
    var method   = 'GET'
      , resource = '/foo'
      , params   = {}
      , callback = function() {}
      , request;

    test('scopes all paths to the session', function() {
      session.request(method, resource, params, callback);

      assert.oneRequest(client, {
          method: method
        , resource: '/session/' + id + resource
        , params: params
        , callback: callback
      });
    });
  }); // request

  suite('url', function() {
    var callback = function() {}
      , request;

    test('retrieves url when called without string', function() {
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
      session.elements(strategy, value, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/elements'
        , params: {using: strategy, value: value}
      });

      /** Simulate a valid response. */
      client.lastRequest.callback.apply(null, [null, {value: [{ELEMENT: elementIds[0]}, {ELEMENT: elementIds[1]}]}]);

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

      session.quit(callback);

      assert.oneRequest(client, {
          method: 'DELETE'
        , resource: '/session/' + id
        , callback: callback
      });
    });
  }); // quit
  suite('execute', function() {
    test('works with a string but without arguments', function() {
      var fn       = 'hello()'
        , value    = {}
        , callback = spy().withArgs(null, value);

      session.execute(fn, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/execute'
        , params: {script: fn, args: []}
      });

      // Simulate valid response.
      client.lastRequest.callback.apply(null, [null, {value: value}]);

      assert.ok(callback.withArgs(null, value).called);
    });

    test('works with a string and arguments', function() {
      var fn       = 'hello()'
        , args     = ['arg1', 'arg2']
        , value    = {}
        , callback = spy().withArgs(null, value);

      session.execute(fn, args, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/execute'
        , params: {script: fn, args: args}
      });

      // Simulate valid response.
      client.lastRequest.callback.apply(null, [null, {value: value}]);

      assert.ok(callback.withArgs(null, value).called);
    });

    test('converts function into a string', function() {
      var fn       = function() { return 1 + 1; }
        , value    = {}
        , callback = spy().withArgs(null, value);


      session.execute(fn, callback);

      assert.oneRequest(client, {
          method: 'POST'
        , resource: '/session/' + id + '/execute'
        , params: {script: 'return 1 + 1;', args: []}
      });

      // Simulate valid response.
      client.lastRequest.callback.apply(null, [null, {value: value}]);

      assert.ok(callback.withArgs(null, value).called);
    });
  }); // execute
}); // Session
