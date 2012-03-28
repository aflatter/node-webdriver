var Endpoint   = require('./endpoint')
  , Client     = require('./client')
  , ClientMock = require('./client_mock')
  , Session    = require('./session');

exports.Endpoint   = Endpoint;
exports.Client     = Client;
exports.ClientMock = ClientMock;
exports.Session    = Session;

exports.endpoint = function(opts) {
  return Endpoint.create(opts);
};

