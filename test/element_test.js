/*global suite test setup*/

var assert     = require('chai').assert
  , spy        = require('sinon').spy
  , wd         = require('./lib')
  , Element    = wd.Element
  , TestHelper = wd.TestHelper;

suite('Element', function() {
  var element, session, id;

  setup(function() {
    id      = 'EL-1';
    element = Element.create({id: id, session: null});
    TestHelper.stubRequest(element);
  });

  suite('constructor', function() {
    var opts;

    setup(function() { opts = {id: id, session: session}; });

    function matches(element) {
      assert.equal(element.id,           id,      'id is set on the instance');
      assert.equal(element.session,      session, 'session is set on the instance');

      assert.instanceOf(element, Element);
    }

    test('making a new instance using .create()', function() {
      matches(Element.create(opts));
    });

    test('making a new instance using the new keyword', function() {
      matches(new Element(opts));
    });
  }); // constructor

  suite('request', function() {
    var method   = 'GET'
      , resource = '/foo'
      , params   = {}
      , callback = function() {}
      , request;

    test('scopes all paths to the session', function() {
      session = TestHelper.mockClient();
      element = Element.create({id: id, session: session});

      element.request(method, resource, params, callback);

      assert.oneRequest(session, {
          method:   method
        , resource: '/element/' + id + resource
        , params:   params
        , callback: callback
      });
    });
  }); // request

  suite('value', function() {
    test('takes a string', function() {
      var string   = 'Hello World'
        , callback = function() {};

      element.value(string, callback);

      assert.oneRequest(element, {
          method: 'POST'
        , resource: '/value'
        , params: {value: [string]}
        , callback: callback
      });
    });

    test('takes an array', function() {
      var array    = ['H', 'e', 'l', 'l', 'o']
        , callback = function() {};

      element.value(array, callback);

      assert.oneRequest(element, {
          method: 'POST'
        , resource: '/value'
        , params: {value: array}
        , callback: callback
      });
    });
  }); // value

  suite('click', function() {
    test('does the right thing', function() {
      var callback = function() {};

      element.click(callback);

      assert.oneRequest(element, {
          method: 'POST'
        , resource: '/click'
        , params: {}
        , callback: callback
      });
    });
  }); // click

  suite('text', function() {
    test('does the right thing', function() {
      var text     = 'Text'
        , callback = spy().withArgs(null, text);

      element.text(callback);

      assert.oneRequest(element, {
          method: 'GET'
        , resource: '/text'
        , params: null
      });

      // Simulate successful response.
      element.lastRequest.callback.apply(null, [null, {value: text}]);

      assert.ok(callback.withArgs(null, text).calledOnce);
    });
  }); // text
}); // Element
