var misc = require('./misc');

var Session = module.exports = constructor
  , proto   = Session.prototype = {};

Session.create = function() {
  var instance = Object.create(proto);
  constructor.apply(instance, arguments);
  return instance;
}

/**
 * Constructor
 */
function constructor(opts) {
  opts = opts || {};

  this.id           = opts.id;
  this.client       = opts.client;
  this.capabilities = opts.capabilities;
}

/**
 * Add http method helpers.
 */
misc.http.defineHelpers(proto);

/**
 * Sends a request with the path scoped to this session.
 *
 * @param {String}   method
 * @param {String}   resource
 * @param {Object}   params
 * @param {Function} callback
 */
proto.request = function(method, resource, params, callback) {
  resource = '/session/' + this.id + resource;
  this.client.request(method, resource, params, callback);
};

/**
 * Gets or sets the url.
 *
 * @param {String}   [url]
 * @param {Function} callback
 */
proto.url = function(url, callback) {
  if (typeof url === 'function') {
    callback = url;
    url = null;
  }

  if (url) {
    this.post('/url', {url: url}, callback);
  }
  else {
    this.get('/url', callback);
  }
};

/**
 * Executes javascript in the browser.
 *
 * @param {Function, String} fn       A string of code to eval or a function.
 * @param {Array}            [args]   Optional array of arguments to pass to the function.
 * @param {Function}         callback
 */
proto.execute = function(fn, args, callback) {
  if (typeof fn === 'function') {
    fn = fn.toString().replace(/^function \(\) \{ /, '').replace(/\s*\}\s*/, '');
  }

  if (typeof args === 'function') {
    callback = args;
    args     = null;
  }

  args = args || [];

  this.post('/execute', {script: fn, args: args}, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, res.value);
  });
};

/**
 * Quits the session.
 *
 * @param {Function} callback
 */
proto.quit = function(callback) {
  this.delete('', null, function(err) {
    callback(err);
  });
};

/**
 * Sets a timeout in miliseconds.
 *
 * @param {String}   name     Can be 'async_script' or 'implicit_wait'.
 * @param {Number}   ms       The desired timeout in miliseconds.
 * @param {Function} callback
 */
proto.timeout = function(name, ms, callback) {
  this.post('/timeouts/' + name, {ms: ms}, function(err) {
    callback(err);
  });
};
