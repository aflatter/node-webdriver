var misc = require('./misc');

/**
 * An Element represents a single DOM element within the browser.
 * It implements all methods of /session/:sessionId/element/:id.
 *
 * @class
 */
var Element = module.exports = constructor
  , proto   = Element.prototype = {};

Element.create = function() {
  var instance = Object.create(proto);
  constructor.apply(instance, arguments);
  return instance;
};

/**
 * Constructor
 *
 * @param {String}  opts.id      A WebElement id returned by the driver.
 * @param {Session} opts.session The session to which this element belongs.
 */
function constructor(opts) {
  opts = opts || {};

  this.id      = opts.id;
  this.session = opts.session;
}

/**
 * Add HTTP method helpers.
 */
misc.http.defineHelpers(proto);

/**
 * Sends a request with the path scoped to this element.
 *
 * @param {String}   method
 * @param {String}   resource
 * @param {Object}   params
 * @param {Function} callback
 */
proto.request = function(method, resource, params, callback) {
  resource = '/element/' + encodeURIComponent(this.id) + resource;
  this.session.request(method, resource, params, callback);
};

/**
 * Send a sequence of key strokes to the element.
 *
 * @param {Array,String} value Either a simple string or an array representing the sequence.
 * @param {Function} callback
 */
proto.value = function(value, callback) {
  if (typeof value === 'string') {
    value = [value];
  }

  this.post('/value', {value: value}, callback);
};

/**
 * Click on an element.
 */
proto.click = function(callback) {
  this.post('/click', {}, callback);
};

/**
 * Returns the visible text for the element.
 *
 * @param {Function} callback
 */
proto.text = function(callback) {
  this.get('/text', null, function(err, result) {
    callback(err, result.value);
  });
};
