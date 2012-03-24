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
 * Add HTTP method helpers.
 */
misc.http.defineHelpers(proto);

