var Client  = require('./client')
  , Session = require('./session');

var Endpoint = module.exports = constructor
  , proto    = Endpoint.prototype = {};

/**
 * Endpoint
 *
 * @class
 */
Endpoint.create = function() {
  var instance = Object.create(proto);
  constructor.apply(instance, arguments);
  return instance;
};

/**
 * Constructor
 */
function constructor(opts) {
  opts = opts || {};

  if (opts.client) {
    this.client = opts.client;
    return;
  }

  this.client = Client.create({
      host: opts.host
    , port: opts.port
    , path: opts.path
  });
}

/**
 * Retrieves status of the endpoint.
 *
 * @param {Function} callback
 */
proto.status = function(callback) {
  this.client.get('/status', function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, res.value);
  });
};

/**
 * Creates a new session.
 *
 * @param {Object}   [caps]   Desired capabilities, e.g. {browserName: 'firefox'}.
 * @param {Function} callback
 */
proto.session = function(caps, callback) {
  var params;

  // Capabilities are optional.
  if (typeof caps === 'function') {
    callback = caps;
    caps = null;
  }

  // desiredCapabilities must be sent, even if empty.
  params = {desiredCapabilities: caps || {}};

  var self = this;
  this.client.post('/session', params, function(err, res) {
    var session;

    if (err) {
      return callback(err);
    }

    session = Session.create({
        id:           res.sessionId
      , client:       self.client
      , capabilities: res.value
    });

    callback(null, session);
  });
};
