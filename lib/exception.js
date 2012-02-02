/**
 * An exception class for webdriver errors.
 *
 * @class
 */
var Exception = module.exports = constructor,
    proto     = Exception.prototype = {};

/**
 * Constructor
 */
function constructor(status) {
  var error = this.errors[status];

  this.name    = error.name;
  this.message = error.message;
};

/**
 * Error definitions from the spec.
 */
proto.errors = {
    0: {
        name:    "Success"
      , message: "The command executed successfully."
    }
  , 7: {
        name:    "NoSuchElement"
      , message: "An element could not be located on the page using the given search parameters."
    }
  , 8: {
        name:    "NoSuchFrame"
      , message: "A request to switch to a frame could not be satisfied because the frame could not be found."
    }
  , 9: {
        name:    "UnknownCommand"
      , message: "The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource."
    }
  , 10: {
        name:    "StaleElementReference"
      , message: "An element command failed because the referenced element is no longer attached to the DOM."
    }
  , 11: {
        name:    "ElementNotVisible"
      , message: "An element command could not be completed because the element is not visible on the page."
    }
  , 12: {
        name:    "InvalidElementState"
      , message: "An element command could not be completed because the element is in an invalid state (e.g. attempting to click a disabled element)."
    }
  , 13: {
        name:    "UnknownError"
      , message: "An unknown server-side error occurred while processing the command."
    }
  , 15: {
        name:    "ElementIsNotSelectable"
      , message: "An attempt was made to select an element that cannot be selected."
    }
  , 17: {
        name:    "JavaScriptError"
      , message: "An error occurred while executing user supplied JavaScript."
    }
  , 19: {
        name:    "XPathLookupError"
      , message: "An error occurred while searching for an element by XPath."
    }
  , 21: {
        name:    "Timeout"
      , message: "An operation did not complete before its timeout expired."
    }
  , 23: {
        name:    "NoSuchWindow"
      , message: "A request to switch to a different window could not be satisfied because the window could not be found."
    }
  , 24: {
        name:    "InvalidCookieDomain"
      , message: "An illegal attempt was made to set a cookie under a different domain than the current page."
    }
  , 25: {
        name:    "UnableToSetCookie"
      , message: "A request to set a cookie's value could not be satisfied."
    }
  , 26: {
        name:    "UnexpectedAlertOpen"
      , message: "A modal dialog was open, blocking this operation"
    }
  , 27: {
        name:    "NoAlertOpenError"
      , message: "An attempt was made to operate on a modal dialog when one was not open."
    }
  , 28: {
        name:    "ScriptTimeout"
      , message: "A script did not complete before its timeout expired."
    }
  , 29: {
        name:    "InvalidElementCoordinates"
      , message: "The coordinates provided to an interactions operation are invalid."
    }
  , 30: {
        name:    "IMENotAvailable"
      , message: "IME was not available."
    }
  , 31: {
        name:    "IMEEngineActivationFailed"
      , message: "An IME engine could not be started."
    }
  , 32: {
        name:    "InvalidSelector"
      , message: "Argument was an invalid selector (e.g. XPath/CSS)."
    }
}
