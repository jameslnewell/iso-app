var vdom = require('virtual-dom');
var toHTML = require('vdom-to-html');
var router = require('./router');

/**
 * An isomorphic application
 * @constructor
 * @returns {Application}
 */
function Application(options) {

  if (!(this instanceof Application)) {
    return new Application(options);
  }

  options       = options || {};
  this._locator = options.locator;
  this._router  = router();

}

Application.prototype = {

  /**
   * Map a route to a module
   * @param   {string|RegExp}           pattern
   * @param   {Object}                  module
   * @returns {Application}
   */
  map: function(pattern, module) {
    this._router.map(pattern, module);
    return this;
  },

  /**
   * Route the application to a URL
   * @param   {string}                  url
   * @param   {function(Error, Page)}   callback
   * @returns {Application}
   */
  route: function(url, callback) {
    var route = this._router.route(url);

    var page = {
      url:    route.url,
      params: route.params,
      title:  route.title,
      view:   null
    };

    if (route.handler) {

      //run the handler and call the handler with the page
      route.handler(page, function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(err, page);
        }
      });

    } else {
      callback(new Error('404: Page not found'), null); //TODO: not found
    }

    return this;
  }

};

module.exports = Application;