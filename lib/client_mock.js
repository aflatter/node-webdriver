/**
 * A mock implementation of the Client interface.
 *
 * @class
 */
var ClientMock = module.exports = constructor
  , proto      = ClientMock.prototype = {};

/**
 * Constructor
 */
function constructor() {}

/**
 * Request
 */
proto.request = function(method, resource, params, callback) {
  this.lastRequest = {
      method:   method
    , resource: resource
    , params:   params
    , callback: callback
  };
};

/**
 * Helper methods for HTTP requests.
 */
['get', 'post', 'put', 'delete'].forEach(function(method) {
  proto[method] = function(resource, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params   = null;
    }

    this.request(method, resource, params, callback);
  };
});
