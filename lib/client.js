var http       = require('http')
  , underscore = require('underscore')
  , clone      = underscore.clone
  , misc       = require('./misc')
  , Exception  = require('./exception');

var Client = module.exports = constructor
  , proto  = Client.prototype = {};

Client.create = function() {
  var instance = Object.create(proto);
  constructor.apply(instance, arguments);
  return instance;
}

/**
 * Constructor
 */
function constructor(opts) {
  opts = opts || {};

  this.host = opts.host || 'localhost';
  this.port = opts.port || 9515;
  this.path = opts.path || '';

  underscore.bindAll.call(underscore, [this] + this._bound);
};

/**
 * Specifies which methods are bound to the instance.
 */
proto._bound = [
    '_requestDidFail'
  , '_requestDidError'
  , '_requestDidComplete'
];

/**
 * Default options for HTTP requests.
 */
proto.defaults = {
    encoding: 'utf-8'
  , agent:    false
  , headers: {
      'Accept':         '*/*'
    , 'Content-Type':   'application/json;charset=utf-8'
  }
};

/**
 * Add HTTP method helpers.
 */
misc.http.defineHelpers(proto);

/**
 * Low level method for sending a command to the server.
 *
 * @param {String}   method   The HTTP method to use.
 * @param {String}   resource Path to append to the base url, e.g. '/status'.
 * @param {Object}   [params] Optional parameters to send.
 * @param {Function} callback The callback to invoke when the request finishes.
 */
proto.request = function(method, resource, data, callback) {
  var client  = this
    , options = clone(this.defaults)
    , req;

  options.host   = this.host;
  options.port   = this.port;
  options.path   = this.path + resource;
  options.method = method;

  if (data) {
    data = JSON.stringify(data);
    options.headers['Content-Length'] = data.length;
  }

  req = http.request(options)
  
  // Buffer up the response body and proceed.
  req.on('response', function(res) {
    var body = "";

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      client._requestDidComplete(res, body, callback);
    });
  });

  req.on('error', function(error) {
    client._requestDidError(req, error, callback);
  });

  req.end(data);
};

/**
 * Called when the request fails on HTTP level or below.
 *
 * @param {http.ClientRequest}  req
 * @param {Error}               error
 * @param {Function}            callback
 * @private
 */
proto._requestDidError = function(req, error, callback) {
  callback(error);
};

/**
 * Called when the HTTP request completed successfully.

 * @param {http.ClientResponse} res
 * @param {Error}               error
 * @param {Function}            callback
 * @private
 */
proto._requestDidComplete = function(res, body, callback) {
  var code = res.statusCode
    , type = res.headers['content-type'] || ""
    , error, data;

  // A status between 400 and 599 means that an error occured.
  if (code >= 400 && code < 600) {
    return this._requestDidFail(res, body, callback);
  }

  // Automatically follow redirects.
  if (code >= 300 && code < 400) {
    return this.get(res.headers['location'], callback);
  }

  if (!type.match('application/json')) {
    console.warn('Expected header "Content-Type" to be "application/json" but got "%s".', type);
  }

  try {
    data = JSON.parse(body);

    if (data.status !== 0) {
      error = new Exception(data.status);
    }
  }
  catch(e) {
    error = e;
  }
  
  callback(error, data);
};

/**
  This method is called when a request fails on the webdriver level.

  @param {http.ClientResponse} res
  @param {String}              body
  @param {Function}            cb
  @private
*/
proto._requestDidFail = function(res, body, cb) {
  var type, data, error;

  type = res.headers['content-type'] || ""

  // The content-type is expected to be text/plain.
  if (type !== 'text/plain') {
    console.warn('Expected header "Content-Type" to be "text/plain" but got "%s".', type);
  }

  // The response body should contain a human readable error message. Some endpoints
  // (e.g. chrome driver) return error messages encoded as JSON.
  if (type.match("application/json")) {
    try {
      data = JSON.parse(body);
      error = data && data.value && data.value.message;
    }
    catch(SyntaxError) {}
  }
  else {
    error = body;
  }

  // This method is only called when the status code is between 400 and 600.
  // According to the spec, a code 404 has a different message.
  if (!error) {
    error = res.statusCode === 404 ? "Unknown command" : "Unknown error";
  }

  cb(error);
};
