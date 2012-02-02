var Endpoint = require('./endpoint')
  , Client   = require('./client')
  , Session  = require('./session');

exports.Endpoint = Endpoint;
exports.Client   = Client;
exports.Session  = Session;

exports.endpoint = function(opts) {
  return Endpoint.create(opts);
}

