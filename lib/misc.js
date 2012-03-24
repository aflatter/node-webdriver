exports.http = {};
exports.http.defineHelpers = function(target) {
  ['get', 'post', 'put', 'delete'].forEach(function(method) {
    target[method] = function(resource, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params   = null;
      }

      method = method.toUpperCase();
      this.request(method, resource, params, callback);
    };
  });
};
