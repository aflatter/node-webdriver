var Client     = require('./client')
  , ClientMock = require('./client_mock')
  , Element    = require('./element')
  , Endpoint   = require('./endpoint')
  , Session    = require('./session');

exports.Client     = Client;
exports.ClientMock = ClientMock;
exports.Element    = Element;
exports.Endpoint   = Endpoint;
exports.Session    = Session;

exports.endpoint = function(opts) {
  return Endpoint.create(opts);
};

