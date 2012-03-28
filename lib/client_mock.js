var misc = require('./misc');

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
function constructor() {
  this.callCount = 0;
}

/**
 * Request
 */
proto.request = function(method, resource, params, callback) {
  this.callCount++;
  this.lastRequest = {
      method:   method
    , resource: resource
    , params:   params
    , callback: callback
  };
};

/**
 * Add HTTP method helpers.
 */
misc.http.defineHelpers(proto);

