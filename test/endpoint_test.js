var assert     = require('chai').assert
  , spy        = require('sinon').spy
  , Endpoint   = require('webdriver/lib/endpoint')
  , Session    = require('webdriver/lib/session')
  , ClientMock = require('webdriver/lib/client_mock');

suite('Endpoint', function() {
  test('status()', function() {
    var client   = new ClientMock()
      , endpoint = Endpoint.create({client: client})
      , callback = spy();

    endpoint.status(callback);

    // Verify that a proper request was made.
    var lastRequest = client.lastRequest;
    assert.ok(lastRequest, 'a request was made');
    assert.equal(lastRequest.method,   'GET');
    assert.equal(lastRequest.resource, '/status');
    assert.isNull(lastRequest.params);

    lastRequest.callback(null, {status: 0, value: {foo: 'bar'}});

    var error  = callback.getCall(0).args[0]
      , status = callback.getCall(0).args[1];

    assert.isNull(error);
    assert.deepEqual(status, {foo: 'bar'});
  }); // status()
  test('session()', function() {
    var client   = new ClientMock()
      , endpoint = Endpoint.create({client: client})
      , callback = spy();

    endpoint.session(callback);

    // Verify that a proper request was made.
    var lastRequest = client.lastRequest;
    assert.ok(lastRequest, 'a request was made');
    assert.equal(lastRequest.method,   'POST');
    assert.equal(lastRequest.resource, '/session');
    assert.deepEqual(lastRequest.params  , {desiredCapabilities: {}});

    // Fake a successfull request.
    lastRequest.callback(null, {status: 0, sessionId: '1', value: {browserName: 'firefox'}});

    assert.ok(callback.calledOnce);

    var error   = callback.getCall(0).args[0]
      , session = callback.getCall(0).args[1];

    assert.isNull(error);

    assert.instanceOf(session, Session, 'result is an instance of Session');

    assert.equal(session.id, '1');
    assert.deepEqual(session.capabilities, {browserName: 'firefox'});
  }); // session()
}); // Endpoint
