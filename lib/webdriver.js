var assert     = require('./assert')
  , Client     = require('./client')
  , Element    = require('./element')
  , Endpoint   = require('./endpoint')
  , Session    = require('./session')
  , TestHelper = require('./test_helper');

exports.assert     = assert;
exports.Client     = Client;
exports.Element    = Element;
exports.Endpoint   = Endpoint;
exports.Session    = Session;
exports.TestHelper = TestHelper;

exports.endpoint = function(opts) {
  return Endpoint.create(opts);
};

