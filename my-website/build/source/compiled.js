/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
;// CONCATENATED MODULE: ./framework/3_config/processors/DefaultSettings.js
var defaults = {
  consent_mode_platforms: ["gac", "gar", "flt", "flsc", "fluc", "flpsc"],
  // ga4 missing bc page view redirect
  frontend_only_platforms: ["linkedin", "bing", "twt", "ptrst"],
  url_queries_to_exclude: ["fbclid", "ref-original", "sfmc_id", "consent", "msclkid"],
  redact_emails_in_url: true,
  limited_platforms: {
    "twt": {
      whitelist: ["page_view", "add_to_cart", "add_to_wishlist", "complete_registration", "download", "begin_checkout", "purchase", "sign_up", "view_item", "view_item_list"]
    }
  }
};
;// CONCATENATED MODULE: ./framework/1_utils/cookies/_setCookie.js
/**
 * Sets a cookie
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */
function _setCookie(name, value, days) {
  var expires = "";

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
}
;// CONCATENATED MODULE: ./framework/1_utils/cookies/_deleteCookie.js

function _deleteCookie(name) {
  _setCookie(name, "", -1);
}
;// CONCATENATED MODULE: ./framework/1_utils/cookies/_getCookie.js
/**
 * Returns a value of a cookie given by name
 * @param {string} c_name
 * @return {null|string} 
 */
function _getCookie(c_name) {
  var c_value = " " + document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");

  if (c_start == -1) {
    c_value = null;
  } else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);

    if (c_end == -1) {
      c_end = c_value.length;
    }

    c_value = decodeURIComponent(c_value.substring(c_start, c_end));
  }

  return c_value;
}
;// CONCATENATED MODULE: ./framework/1_utils/misc/_contains.js
function _contains_contains(array, needle) {
  return array.indexOf(needle) > -1;
}
;// CONCATENATED MODULE: ./framework/1_utils/misc/_error.js
/**
 * Thrors Error with given arguments
 * @throws {Error}
 * @param {string} msg 
 * @param {*} meta 
 */

/** @suppress {globalThis|checkTypes} */
function _error() {
  var msg = [].slice.call(arguments, 0).join("");
  var err = new Error(msg);
  err.type = "assistant_error"; // Error.captureStackTrace( err, getStackTrace );

  throw err;
}
;// CONCATENATED MODULE: ./framework/2_system/Storage.js

var storage = {};
function _store(key, value, merge) {
  if (!_isStr(key)) _error("Only string keys are supported. Received: " + _getType(key));
  if (key.indexOf("config.") === 0) _error("Setting config variables is not allowed");
  if (key.indexOf("_command.") === 0 && !_getType_isFn(value)) _error("Only commands of type function are allowded. Received: " + _getType(value));
  return _setValue(key, value, storage, merge);
}
function _get(key) {
  if (storage.config && storage.config.debugMode && !key) return storage;
  return _getValue_getValue(key, storage);
}
;// CONCATENATED MODULE: ./framework/1_utils/misc/_getReportingIds.js

function _getReportingIds() {
  var config = _get("config");

  return config && config.debugMode ? [] : ["G-D2ZJ2NRE85", "UA-181867551-3"];
}
;// CONCATENATED MODULE: ./framework/1_utils/misc/_getRunner.js

var SAFE_RUNNER_STATES = {
  "NOT_STARTED_YET": 1,
  "RECEIVED_ERROR": 2,
  "SUCCESSFULLY_RUN": 3
};

function SafeRunner(config_obj) {
  this.current_state = "NOT_STARTED_YET";
  this.error_msg_received = null;
  this.config_obj = config_obj;
}

SafeRunner.prototype.setState = function (state) {
  if (!SAFE_RUNNER_STATES[state]) {
    this.current_state = "Invalid state received: '" + state + "'";
    return;
  } else this.current_state = state;
};

SafeRunner.prototype.execute = function () {
  if (this.config_obj.async) {
    var bound = this.doExecute.bind(this, arguments);
    setTimeout(bound, 0);
  } else {
    this.doExecute(arguments);
  }
};

SafeRunner.prototype.doExecute = function (args) {
  try {
    var result = this.config_obj.func.apply(this.config_obj.context, args);
    this.setState("SUCCESSFULLY_RUN");
    addMessageResult(this, args[0], this.current_state);
    return result;
  } catch (error) {
    this.setState("RECEIVED_ERROR");
    this.error_msg_received = error;
    addMessageResult(this, args[0], this.current_state);

    _trackAssistantError("Error caught while executing func } from getRunner. Msg: '" + this.config_obj.error_msg + "'", error);

    return "error_received";
  }
};

function _getRunner(config_obj) {
  if (!_getType_isFn(config_obj.func) || !_isStr(config_obj.error_msg)) {
    _error("Insufficient config object in _getRunner.");
  }

  return new SafeRunner(config_obj);
}

function isMessage(arg) {
  return arg.constructor.name === "Message";
}

function addMessageResult(listener, msg, res) {
  if (!isMessage(msg)) return;
  msg.addListenerExecutionResult(listener, res);
}
;// CONCATENATED MODULE: ./framework/1_utils/misc/_log.js
function _log(arg) {
  console.log(arg);
  return arg;
}
;// CONCATENATED MODULE: ./framework/1_utils/misc/_run.js


/**
* Pulic entry point for calling runCommand
* @param {*} command
*/

function _run(command, arg1, arg2) {
  "use strict";

  try {
    var func = getFunc(command, arg1, arg2);
    var context = command && command.context;
    if (!func) _error("Command '" + command + "' not found in '_run'.");
    if (func.apply) return func.apply(context, [].slice.call(arguments, 1));else return func(arg1, arg2);
  } catch (error) {
    var local_msg = command.error_msg || "Error of type '" + getErrorType(error) + "' caught in '_run' while trying to execute command '" + getCommandDesc(command) + "'";

    _trackAssistantError(local_msg, error);
  }

  function getErrorType(error) {
    return error.type || "generic error";
  }

  function getCommandDesc(command) {
    var type = _getType(command);

    return type == "string" ? command : type == "function" && command.name ? command.name : type == "function" ? "<anonym function>: '" + command : type == "object" && command.func && command.func.name ? command.func.name : command;
  }

  function getFunc(arg) {
    switch (_getType(arg)) {
      case "string":
        return _get("_commands." + command);

      case "function":
        return arg;

      case "object":
        return arg.func;

      default:
        _error("Type of '" + _getType(arg) + "' commands are not allowed");

    }
  }
}
;// CONCATENATED MODULE: ./framework/1_utils/misc/_trackAssistantError.js


function _trackAssistantError(msg, error_obj) {
  function gtag() {
    window.dataLayer.push(arguments);
  }

  function getStack(error) {
    return error.stack ? error.stack : (error.fileName || "") + (error.lineNumber || "");
  }

  var details = {
    "send_page_view": false,
    "event_category": "GTM Asisstant Error",
    "event_action": msg,
    "event_label": error_obj && error_obj.toString(),
    "callstack": error_obj && getStack(error_obj),
    "send_to": _getReportingIds()
  };
  gtag("event", "gtm_assistant_error", details);

  var config = _get("config");

  if (config && config.debugMode) {
    console.error("Msg: " + msg + "\n\n" + " Original: ", error_obj);
  }
}
;// CONCATENATED MODULE: ./framework/1_utils/objects/_getType.js
/**
 * Determines type of the given parameter "value"
 * Boolean|Number|String|Function|Array|Date|RegExp|Arguments
 * @param {*} value
 * @return {string}
 */
function _getType(value) {
  var TYPE_RE_ = /\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;
  if (value == null) return String(value);
  var match = TYPE_RE_.exec(Object.prototype.toString.call(Object(value)));
  return match ? match[1].toLowerCase() : 'object';
}
function _isArguments(value) {
  return value && _getType(value) === "arguments";
}
function _isStr(value) {
  return value && _getType(value) === "string";
}
function _isNum(value) {
  return value && _getType(value) === "number";
}
function _isArray(value) {
  return value && _getType(value) === "array";
}
function _isObj(value) {
  return value && _getType(value) === "object";
}
function _getType_isFn(value) {
  return value && _getType(value) === "function";
}
function _exists(value) {
  return value !== undefined && value !== null;
}
;// CONCATENATED MODULE: ./framework/1_utils/objects/_setValue.js

/**
 * Sets a value at the given path in the object
 * @param {string} key
 * @param {*} value
 * @param {Object} object
 */

function _setValue(key, value, object, merge) {
  if (!key || _getType(key) != "string") throw new Error("only setting string keys of valid length are supported");
  var levels = key.split(".");
  var item = levels.pop();
  var target = object;

  for (var i = 0; i < levels.length; i++) {
    if (target[levels[i]] === undefined) target[levels[i]] = {};
    target = target[levels[i]];
  }

  if (!merge || _getType(target[item]) != array) target[item] = value;else target[item].concat(value);
  return value;
}
;// CONCATENATED MODULE: ./framework/1_utils/objects/_getValue.js


/**
 * Return a copy of the value at the given path inside the object if it exists 
 * or undefined otherwise
 * @param {string} key
 * @param {Object} object
 * @return {*} 
 */

function _getValue_getValue(key, object) {
  if (!key || _getType(key) != "string") _error("Only getting string keys of valid length are supported. Received: '" + key + "'");
  if (!object) _error("Object must be provided");
  var levels = key.split(".");
  var item = object;

  for (var i = 0; i < levels.length; i++) {
    item = item[levels[i]];
    if (item === undefined) return undefined;
  }

  return item;
}
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_getElementText.js
function _getElementText(element, max_length) {
  if (!element) return null;
  var text;

  if (element.tagName === "IMG") {
    text = element.alt ? "Alt: '" + element.alt + "'" : "";
    text += element.title ? " | Title: '" + element.title + "'" : "";
  } else if (element.nodeName == "INPUT") {
    text = element.value;
  } else {
    text = element.innerText || element.textContent || "";
  }

  return text.replace(/[ \s\t\n]+/gi, " ").trim().slice(0, max_length || 150);
}
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_getNodesArray.js
function _getNodesArray(one_or_more_css_selectors, context_node_object) {
  if (!one_or_more_css_selectors) return [];
  var context_node = context_node_object || document.body;
  var css_selectors_array = [].concat(one_or_more_css_selectors);
  var node_list = context_node.querySelectorAll(css_selectors_array.join(", "));
  return [].reduce.call(node_list, function (all, current) {
    return all.concat(current);
  }, []);
}
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_getNumber.js
var cached_decimal;

var getNumericMarkup = function getNumericMarkup(numeric_string) {
  if (!cached_decimal) {
    getDecimalSeparator(num_str.replace(/([^\d\.,])/gi, ""));
  }

  return getLocalDecimalMarkup(String(numeric_string));
};

var getLocalDecimalMarkup = function getLocalDecimalMarkup(num_str) {
  switch (cached_decimal) {
    case ".":
      return num_str.replace(/([^\d\.])/gi, "");

    case ",":
      return num_str.replace(/([^\d,])/gi, "");

    case undefined:
      return num_str.replace(/([^\d])/gi, "");
  }
};

var getDecimalSeparator = function getDecimalSeparator(numeric_value) {
  var dot_index = numeric_value.indexOf(".");
  var comma_index = numeric_value.indexOf(",");
  var separator = "";

  if (dot_index > -1 && comma_index > -1) {
    separator = dot_index > comma_index ? "." : ",";
  } // dot is a decimal separator placed 2 decimals } from the end: 124.22


  if (dot_index > -1 && dot_index === numeric_value.length - 3) {
    separator = ".";
  } // comma is a decimal separator placed 2 decimals } from the end: 124,22


  if (comma_index > -1 && comma_index === numeric_value.length - 3) {
    separator = ",";
  } // dot is a thousands separator placed 3 digits } from the end: 124.222
  // thus comma is the decimal separator


  if (dot_index > -1 && dot_index === numeric_value.length - 4) {
    separator = ",";
  } // comma is a thousands separator placed 3 digits } from the end: 124,222
  // thus dot is the decimal separator


  if (comma_index > -1 && comma_index === numeric_value.length - 4) {
    separator = ".";
  }

  if (separator) {
    cached_decimal = separator;
  }

  return separator;
};

function _getNumber_getNumber(numeric_string) {
  var local_decimal_markup = getNumericMarkup(numeric_string);
  var english_format = local_decimal_markup.replace(",", ".");
  return parseFloat(english_format);
}
;
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_getSingleNode.js
function _getSingleNode(selector_str, context_node) {
  return selector_str && (context_node || document).querySelector(selector_str);
}
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_getElementClasses.js

function _getElementClasses(element) {
  return element && element.className && _getType_isFn(element.className.split) && element.className.split(" ") || [];
}
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_hasClass.js

function _hasClass(element, className) {
  return _getElementClasses(element).indexOf(className) > -1;
}
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_isHtmlElement.js
function _isHtmlElement(element) {
  return element instanceof Element;
}
;// CONCATENATED MODULE: ./framework/1_utils/parsing/_parseHref.js
function getBaseURI() {
  return document.baseURI;
}

;

function getCurrentProtocol() {
  return getBaseURI().split("://")[0];
}

;

function getCurrentHostAndProtocol() {
  return getBaseURI().split("/").slice(0, 3).join("/");
}

;

function getFullUrl(href) {
  if (href.indexOf("://") > -1) return href;
  if (href.indexOf("//") === 0) return getCurrentProtocol() + "://" + href.replace("//", "");
  if (href.indexOf("/") === 0) return getCurrentHostAndProtocol() + href;
  var split = getBaseURI().split("/");

  if (href.indexOf("../") === 0) {
    if (split.length >= 5) {
      split.splice(-2, 2);
      return split.concat(href.replace("../", "")).join("/");
    }
  } // realative path, beginning with file name. ex: href="file.htm"


  if (split.length >= 4) split.pop();
  split.push(href);
  return split.join("/");
}

function parseQueryReducer(acc, str) {
  var split = (str || "").split("=");
  var key = decodeURIComponent(split[0]);
  var value = decodeURIComponent(split[1]) || "";
  acc[key] = value;
  return acc;
}

function _parseHref(href, parse_query) {
  if (!href) return {};
  if (href.indexOf("tel:") === 0) return {
    "url": href
  };
  if (href.indexOf("mailto:") === 0) return {
    "url": href
  };
  if (href.indexOf("javascript:") === 0) return {
    "url": href
  };
  var url = getFullUrl(href);
  var base_split = url.split("/");
  var file_query_hash = base_split.length >= 4 ? base_split.pop() : "";
  var query_split = file_query_hash.split("?");
  var file = query_split[0];
  var file_split = file.split(".");
  var host_split = (base_split[2] || "").split(":");
  var out = {
    url: url,
    file: file,
    file_extension: file_split.length > 1 ? file_split.pop() : "",
    query: (query_split[1] || "").split("#")[0],
    hash: file_query_hash.split("#")[1] || "",
    protocol: base_split[0].replace(":", ""),
    host: host_split[0],
    port: host_split[1] || "",
    path: "/" + (base_split.splice(3) || []).join("/"),
    queries: {}
  };

  if (parse_query && out.query) {
    out.queries = out.query.split("&").reduce(parseQueryReducer, {});
  }

  return out;
}
;// CONCATENATED MODULE: ./framework/1_utils/pixels/_addQueries.js


function _addQueries(url, queries_obj) {
  var queries_obj = queries_obj || {};

  if (!_isObj(queries_obj)) {
    _log("Queries provided to add to a script url should be of form object.");
  }

  var keys = Object.keys(queries_obj);
  if (!keys.length) return url;
  var query_str_added = keys.reduce(function (all, key) {
    return all.concat(encodeURIComponent(key) + "=" + encodeURIComponent(queries_obj[key]));
  }, []).join("&");
  if (url.indexOf("?") > -1) return url.replace("?", "?" + query_str_added + "&");
  if (url.indexOf("#") > -1) return url.replace("#", "?" + query_str_added + "#");
  return url + "?" + query_str_added;
}
;// CONCATENATED MODULE: ./framework/1_utils/pixels/_addScript.js


/**
 * Adds a script to the header section of a site
 * @param {string} src
 * @param {object} attributes Script tag's HTML attributes to add
 * @param {function} callback Gets the script object before it's added to the DOM
 */

function _addScript(src, attributes, callback) {
  var s = document.createElement("script");

  for (var key in attributes || {}) {
    s.setAttribute(key, String(attributes[key]));
  }

  s.async = true;
  s.src = src;

  s.onerror = function () {
    _log("Script with src", src, "failed to load");
  };

  if (callback) {
    if (!_getType_isFn(callback)) _log("Script callback should be a function");
    callback(s);
  }

  document.head.appendChild(s);
}
;// CONCATENATED MODULE: ./framework/1_utils/pixels/_usagePermissionGranted.js

function _usagePermissionGranted(asset_name, asset_settings) {
  var settings = asset_settings || {};
  var is_denied = settings.blacklist ? _contains_contains(settings.blacklist, asset_name) : false;
  var has_permission = settings.whitelist ? _contains_contains(settings.whitelist, asset_name) : true;
  return !is_denied && has_permission ? true : false;
}
;// CONCATENATED MODULE: ./framework/1_utils/classes/Enum.js
var Enum = {};

Enum.get = function () {
  var _Symbol = window.Symbol || function (arg) {
    return arg;
  };

  var container = Object.create(null);
  var _private_data = {
    reverse: {}
  };
  Object.defineProperty(container, "hasValue", {
    get: function get() {
      return function (arg) {
        return new Boolean(_private_data.reverse[arg]);
      };
    },
    set: function set() {}
  });

  for (var i in arguments) {
    var sym = _Symbol(arguments[i]);

    addStatic(container, arguments[i], sym);
    _private_data.reverse[sym] = arguments[i];
  }

  return container;
};

function addStatic(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    value: value,
    writable: false,
    configurable: false,
    enumerable: false
  });
}
;// CONCATENATED MODULE: ./framework/1_utils/index.js





























;// CONCATENATED MODULE: ./framework/3_config/helpers/getCommaSeparatedData.js
var getCommaSeparatedData = function getCommaSeparatedData(raw_data) {
  var attribute_array = (raw_data || "").split(",").reduce(function (all, curr) {
    var trimmed = String(curr).trim();
    return trimmed ? all.concat(trimmed) : all;
  }, []);
  return attribute_array.join(",");
};
;// CONCATENATED MODULE: ./framework/3_config/helpers/getCustomMap.js
var getCustomMap = function getCustomMap(pixel_customizer_data) {
  var custom_map = {};
  var dimensions = pixel_customizer_data.dimensions || [];
  var metrics = pixel_customizer_data.metrics || [];
  metrics.forEach(function (table_row) {
    custom_map["metric" + table_row.key] = table_row.value;
  });
  dimensions.forEach(function (table_row) {
    custom_map["dimension" + table_row.key] = table_row.value;
  });
  return custom_map;
};
;// CONCATENATED MODULE: ./framework/3_config/classes/Condition.js


var CONDITION_TYPE = Enum.get("PAGE", "EVENT", "CALLBACK");
var COMPARISON_TYPE = Enum.get("EQUALS", "DOES_NOT_EQUAL", "CONTAINS", "BEGINS_WITH", "ENDS_WITH", "MATCHES");
function Condition(config_table_row) {
  var cond_left_data_type = config_table_row.cond_left_data_type,
      cond = config_table_row.cond,
      cond_left = config_table_row.cond_left,
      cond_right = config_table_row.cond_right;
  this.cond_left = cond_left;
  this.cond_right = cond_right;
  this.comparison_type = COMPARISON_TYPE[cond] ? cond : _error("Unsupported Condition type");
  this.condition_type = CONDITION_TYPE[cond_left_data_type] ? cond_left_data_type : _error("Unsupported Condition comparison type");
  if (this.condition_type === "EVENT" && !_isStr(this.cond_left)) _error("Condition left should be a string");else if (this.condition_type === "CALLBACK" && !_isFn(this.cond_left)) _error("Condition left should be a function");
}

Condition.prototype.isTrue = function (event_name, event_attributes) {
  var event_name = event_name || "";
  var event_attributes = event_attributes || {};
  var cond_left = getLeftValue.call(this, event_name, event_attributes) || "";

  switch (this.comparison_type) {
    case "EQUALS":
      return cond_left === this.cond_right;

    case "DOES_NOT_EQUAL":
      return cond_left !== this.cond_right;

    case "CONTAINS":
      return cond_left.indexOf(this.cond_right) > -1;

    case "BEGINS_WITH":
      return cond_left.indexOf(this.cond_right) === 0;

    case "ENDS_WITH":
      return cond_left.endsWith(cond_right);

    case "MATCHES":
      return cond_left.match(new RegExp(cond_right));
  }
};

Condition.prototype.isFalse = function (event_name, event_attributes) {
  return !this.isTrue(event_name, event_attributes);
};

function getLeftValue(event_name, event_attributes) {
  switch (this.condition_type) {
    case "EVENT":
      return event_attributes[this.cond_left];

    case "CALLBACK":
      return this.cond_left();

    case "PAGE":
      return this.cond_left;

    case "EVENT_ATTRIBUTE":
      return event_attributes[this.cond_left];

    case "EVENT_NAME":
      return event_name;

    case "VARIABLE":
      return this.cond_left;
  }
}
;// CONCATENATED MODULE: ./framework/3_config/helpers/getConditions.js

var getConditions = function getConditions(conditions_array) {
  // @todo finish
  return conditions_array.reduce(function (all, current) {
    return all.concat(new Condition(current));
  }, []);
};
;// CONCATENATED MODULE: ./framework/3_config/helpers/getPixelCustomizerData.js



var getPixelCustomizerData = function getPixelCustomizerData(raw_data) {
  if (!raw_data.pixel_attributes) {
    return {};
  }

  var out = {
    pixel_attributes: getCommaSeparatedData(raw_data.pixel_attributes)
  };

  if (raw_data.conditions) {
    out.conditions = getConditions(raw_data.conditions);
  }

  if (raw_data.dimensions || raw_data.metrics) {
    out.custom_map = getCustomMap(raw_data);
  }

  if (raw_data.snapengage_options) {
    out.settings = raw_data.snapengage_options.reduce(function (all, curr) {
      return (all[curr.key] = curr.value) && all;
    }, {});
  }

  if (raw_data.zendesk_department) {
    out.settings = out.settings || {};
    out.settings.zendesk_department = raw_data.zendesk_department;
  }

  if (raw_data.zendesk_locale) {
    out.settings = out.settings || {};
    out.settings.zendesk_locale = raw_data.zendesk_locale;
  }

  return out;
};
;// CONCATENATED MODULE: ./framework/3_config/helpers/getMeasurementSide.js


var getMeasurementSide = function getMeasurementSide(platform, side_of_preferance, has_server_side_endpoint) {
  if (side_of_preferance == "client_only") return "client";else if (side_of_preferance == "server_only") return "server";else return has_server_side_endpoint && !isFrontendPlatformOnly(platform) ? "server" : "client";
};

function isFrontendPlatformOnly(platform) {
  return _contains_contains(defaults.frontend_only_platforms, platform);
}
;// CONCATENATED MODULE: ./framework/3_config/classes/PixelData.js
function PixelData(details) {
  var _this = this;

  this.platform;
  this.custom_map;
  this.settings = {};
  this.conditions = [];
  this.measurement_side;
  this.pixel_attributes;
  Object.keys(details).forEach(function (setting) {
    return _this[setting] = details[setting];
  });
}

PixelData.prototype.getPixelAttributes = function (event_name, event_attributes) {
  if (this.conditions.find(function (cond) {
    return cond.isFalse(event_name, event_attributes);
  })) {
    return false;
  }

  return this.pixel_attributes;
};

PixelData.prototype.getAttributes = function (event_name, event_attributes) {
  if (this.conditions.find(function (cond) {
    return cond.isFalse(event_name, event_attributes);
  })) {
    return false;
  }

  return this.pixel_attributes;
};
;// CONCATENATED MODULE: ./framework/3_config/helpers/getPlatformData.js


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }






var getPixelData = function getPixelData(raw_pixel_data) {
  if (!raw_pixel_data) return {};
  if (!raw_pixel_data.is_pixel_customizer_data) return {
    pixel_attributes: getCommaSeparatedData(raw_pixel_data)
  };
  return getPixelCustomizerData(raw_pixel_data);
};

var getPlatformData = function getPlatformData(config_obj, has_server_side_endpoint) {
  var pixel_data = getPixelData(config_obj.pixel_attributes);
  var platform = String(config_obj.platform).toLowerCase();

  var std_data = _objectSpread({
    platform: platform
  }, pixel_data);

  if (config_obj.target_side) {
    std_data.measurement_side = getMeasurementSide(platform, config_obj.target_side, has_server_side_endpoint);
  }

  return new PixelData(std_data);
};
;// CONCATENATED MODULE: ./framework/3_config/helpers/index.js



;// CONCATENATED MODULE: ./framework/3_config/processors/getConversions.js


var config_template_tables = ["conversion_pixels", "conversion_pixels_custom"];
/* harmony default export */ function getConversions(raw_config) {
  var formatted_conversions = concatConfigTables(raw_config).reduce(function (all_conversions, raw_platform_data) {
    var std_data = getPlatformData(raw_platform_data, !!raw_config.server_side_endpoint);
    var target_event = std_data.event_name = String(raw_platform_data.trigger_event_name).trim();
    if (!std_data.pixel_attributes) return all_conversions;
    all_conversions[target_event] = all_conversions[target_event] || {};
    all_conversions[target_event][std_data.platform] = all_conversions[target_event][std_data.platform] || [];
    all_conversions[target_event][std_data.platform].push(std_data);
    return all_conversions;
  }, {});
  return {
    conversions: formatted_conversions
  };
}

function concatConfigTables(raw_config) {
  return config_template_tables.reduce(function (all_config, table_name) {
    return raw_config[table_name] ? all_config.concat(raw_config[table_name]) : all_config;
  }, []);
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getCopiedSettings.js
/* harmony default export */ function getCopiedSettings(raw_config) {
  return ["baseContainerId", "basket_cookie_lifetime_days", "consentModeIsEnabled", "currency", "debugMode", "GDPRConsentProvider", "GDPRConsentProviderKey", "server_side_endpoint"].reduce(function (all, attr) {
    if (raw_config[attr]) {
      all[attr] = raw_config[attr];
    }

    return all;
  }, {});
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getCrossSiteDomains.js

/* harmony default export */ var getCrossSiteDomains = (function (raw_config) {
  cross_site_domains: getCommaSeparatedData(raw_config.crosssite_domains_text || raw_config.crosssite_domains_variable || "");
});
;// CONCATENATED MODULE: ./framework/3_config/processors/getCustomSettings.js

/* harmony default export */ function getCustomSettings(raw_config) {
  return {
    custom_settings: mapTable(raw_config.custom_settings, raw_config)
  };
}

function mapTable(table, raw_config) {
  return getTableArray(table, raw_config).reduce(function (all, current) {
    return current.key && current.value && (all[current.key] = current.value) && all || all;
  }, {});
}

function getTableArray(table, raw_config) {
  if (_isStr(table) && raw_config[table] && _isArray(raw_config[table])) {
    return raw_config[table];
  }

  if (_isArray(table)) {
    return table;
  }

  return [];
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getEcomSettings.js
/* harmony default export */ function getEcomSettings(raw_config) {
  switch (raw_config.ecommerce_tracking) {
    case "disabled":
      return {};

    case "push_mapping":
      return {
        ecommerce_tracking: "push_mapping"
      };

    case "through_module":
      return getEcomModuleConfig(raw_config);
  }
}

function getEcomModuleConfig(raw_config) {
  return {
    eec_module_config: raw_config.eec_module_config,
    ecomModuleIsEnabled: true
  };
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getEventPermissions.js
/* harmony default export */ var getEventPermissions = (function (raw_config) {
  return {
    attribute_permissions: getPermissionSettings("attribute", raw_config),
    event_permissions: getPermissionSettings("event", raw_config)
  };
});

function getPermissionSettings(subject_type, raw_config) {
  var rule = raw_config[subject_type + "_customization_rule"];
  var list_name = subject_type + "_customization_list";
  var list = getListItemsAsArray(raw_config[list_name]);

  switch (rule) {
    case "whitelist_all":
      return {
        blacklist: []
      };

    case "blacklist_all":
      return {
        whitelist: []
      };

    case "whitelist":
      return {
        whitelist: list
      };

    case "blacklist":
      return {
        blacklist: list
      };
  }
}

function getListItemsAsArray(list_items_raw) {
  return (list_items_raw || []).reduce(function (all, current) {
    return current.name ? all.concat(current.name) : all;
  }, []);
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getSinglePixels.js

/* harmony default export */ function getSinglePixels(raw_config) {
  var config_settings = raw_config.single_instance_pixels || [];
  var formatted = config_settings.reduce(function (all, current) {
    var settings = getPlatformData(current, !!raw_config.server_side_endpoint);
    if (settings.pixel_attributes) all[settings.platform] = settings;
    return all;
  }, {});
  var out = {
    single_pixels: formatted
  };

  if (formatted.googleOptimize) {
    out.is_UI_customization_present = true;
  }

  return out;
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getTaggingSettings.js
var all_default_selectors = {
  "link": "a",
  "button": "button, [role=\"button\"]",
  "image": "img"
};
/* harmony default export */ function getTaggingSettings(raw_config) {
  var tagging_settings = {
    element_visibility_attribute: "data-traqed-item-visibility"
  };

  if (raw_config.auto_tagging || raw_config.custom_tagging) {
    tagging_settings.generic_tagging = getSelectors(raw_config);
  }

  if (raw_config.tagging_opt_out) {
    tagging_settings.exclusion_selectors = getOptOutSelectors(raw_config);
  }

  return tagging_settings;
}

function sortCustomConfig(raw_config) {
  var custom_tagging_prior = {
    link: 1,
    image: 2,
    button: 3
  };
  raw_config.custom_tagging.sort(function (a, b) {
    return custom_tagging_prior[a.name] > custom_tagging_prior[b.name] ? -1 : 1;
  });
}

function getSettingTables(raw_config) {
  if (raw_config.custom_tagging) sortCustomConfig(raw_config);
  return ["custom_tagging", "auto_tagging"].reduce(function (all, table_name) {
    return raw_config[table_name] ? all.concat(raw_config[table_name]) : all;
  }, []);
}

function getSelectors(raw_config) {
  return getSettingTables(raw_config).reduce(function (all, table_row) {
    // only custom selector table has selector field
    var selector = table_row.selector || all_default_selectors[table_row.name];
    var tagging_spec_obj = {
      "name": table_row.name,
      "selector": selector
    };
    return all.concat(tagging_spec_obj);
  }, []);
}

;

function getOptOutSelectors(raw_config) {
  return (raw_config.tagging_opt_out || []).reduce(function (all, table_row) {
    return table_row.element_selector && all.concat([table_row.element_selector, ", ", table_row.element_selector, " *"].join(""));
  }, []).join(", ");
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getTrackingPixels.js

/* harmony default export */ function getTrackingPixels(raw_config) {
  var config_settings = raw_config.multi_instance_pixels || [];
  var tracking_pixels = config_settings.reduce(function (all, current) {
    var settings = getPlatformData(current, !!raw_config.server_side_endpoint);
    if (!settings.pixel_attributes) return all;
    all[settings.platform] = all[settings.platform] || [];
    all[settings.platform].push(settings);
    if (settings.custom_map) gua_settings[settings.pixel_data] = settings.custom_map;
    return all;
  }, {});
  return {
    tracking_pixels: tracking_pixels
  };
}
;
;// CONCATENATED MODULE: ./framework/3_config/processors/getUserDefinedAttributes.js
/* harmony default export */ function getUserDefinedAttributes(raw_config) {
  return {
    user_defined_attributes: raw_config.user_defined_attributes || []
  };
}
;// CONCATENATED MODULE: ./framework/3_config/processors/getCookiebotConsentState.js

var categories = ["statistics", "marketing"];
function getCookiebotConsentState() {
  var cookie = (_getCookie('CookieConsent') || "").toLowerCase();
  return cookie == "-1" ? categories : getAcceptedCookieCategories(cookie);
}

function getAcceptedCookieCategories(cookie) {
  return categories.filter(function isPresent(category) {
    return cookie.indexOf(category + ":true") > -1;
  });
}
;// CONCATENATED MODULE: ./framework/3_config/PolyfillHandler.js

var PolyfillHandler = {};
var _private_data = {
  scripts_added: 0,
  scripts_loaded: 0
};

PolyfillHandler.run = function (ready_callback) {
  _private_data.ready_callback = ready_callback;
  checkStringEndsWith();
  checkEventListener();
  checkObjectAssign();
  checkArrayFind();

  if (_private_data.scripts_added === 0) {
    ready_callback();
  }
};

function registerLoad(script) {
  _private_data.scripts_added++;

  script.onload = function () {
    _private_data.scripts_loaded++;

    if (_private_data.scripts_added === _private_data.scripts_loaded && _private_data.ready_callback) {
      _private_data.ready_callback();
    }
  };
}

function checkEventListener() {
  if (!window.Element.prototype.addEventListener) {
    _addScript("https://cdn.jsdelivr.net/npm/add-event-listener@1.0.0/index.min.js", null, registerLoad);
  }
}

function checkObjectAssign() {
  if (!window.Object.assign) {
    _addScript("https://cdn.jsdelivr.net/npm/object-assign-polyfill@0.1.0/index.min.js", null, registerLoad);
  }
}

function checkArrayFind() {
  Array.prototype.find = Array.prototype.find || function (cb) {
    for (var i in this) {
      if (cb(this[i], null, null)) return this[i];
    }
  };
}

function checkStringEndsWith() {
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }

      return this.substring(this_len - search.length, this_len) === search;
    };
  }
}
;// CONCATENATED MODULE: ./framework/3_config/_module/ConfigHandler.js


function ConfigHandler_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function ConfigHandler_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ConfigHandler_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ConfigHandler_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }















var ConfigHandler = {
  initialize: function initialize(raw_config) {
    var config;
    PolyfillHandler.run(function () {
      config = getCompiledConfig(raw_config);
    });
    return _store("config", config);
  }
};

var getCompiledConfig = function getCompiledConfig(raw_config) {
  return ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread(ConfigHandler_objectSpread({}, getConversions(raw_config)), getCopiedSettings(raw_config)), getCrossSiteDomains(raw_config)), getCustomSettings(raw_config)), getEcomSettings(raw_config)), getEventPermissions(raw_config)), getSinglePixels(raw_config)), getTaggingSettings(raw_config)), getTrackingPixels(raw_config)), getUserDefinedAttributes(raw_config)), {}, {
    utils: {
      getCookiebotConsentState: getCookiebotConsentState
    },
    defaults: defaults
  });
};
;// CONCATENATED MODULE: ./framework/2_system/LifeCycle.js

var lifecycle_model = {
  consent: "",
  event: ""
};
var lifecycle_events = [];
var observer;
var LifeCycleHandler = {
  addObserver: function addObserver(observer) {
    if (!observer || !_getType_isFn(observer.handleEvent)) {
      _error("LifeCycle Observer should have a handleEvent function");
    }

    observer = observer;
  },
  pushEvent: function pushEvent(event_data) {
    for (var key in event_data) {
      if (key in lifecycle_model) {
        _setValue(key, event_data[key], lifecycle_model);
      }
    }

    lifecycle_events.push(event_data);

    if (observer) {
      observer.handleEvent(formatted);
    }
  }
};
;// CONCATENATED MODULE: ./framework/2_system/Logger.js


var Logger = {
  errors: {},
  dataLayerName: "dataLayer",
  gtag: function gtag() {
    var dataLayerController = ModuleHandler.get("data_layer_controller");
    if (dataLayerController) dataLayerController.submitPrimaryMessage(arguments);else window[this.dataLayerName].push(arguments);
  },

  /** @suppress {checkTypes} */
  trackError: function trackError(action, label, template, messages, stackstrings) {
    this.gtag("event", "gtm_tag_error", {
      "send_page_view": false,
      "event_category": "GTM Tag Error",
      "event_action": action,
      "event_label": label,
      "template": template,
      "messages": messages,
      "callstack": stackstrings,
      "send_to": _getReportingIds()
    });
  },

  /** @suppress {checkTypes} */
  getEventKey: function getEventKey(debug_params) {
    return [debug_params.event_id, debug_params.triggering_event_name].join("_");
  },
  getFormattedStack: function getFormattedStack(stack_array) {
    return stack_array.reduceRight(function (a, c) {
      return a.indexOf(c.line) === -1 ? a.concat(c.line) : a;
    }, []).join(" > ");
  },
  getReport: function getReport(error) {
    var stack_array = _getValue_getValue("error.g", error);

    var lineFormatOk = stack_array && stack_array[0] && stack_array[0].line;
    var last_line = lineFormatOk && stack_array.slice(0, 1)[0].line;
    var stackline = lineFormatOk && "lines: " + this.getFormattedStack(stack_array);
    var errorMsg = _getValue_getValue("error.s.message", error) || "none";
    var formatted_msg = "Error on line '" + last_line + "': " + errorMsg;
    return {
      "msg": formatted_msg,
      "stack": stackline
    };
  },

  /** @suppress {checkTypes} */
  logTemplateError: function logTemplateError(debug_params, error) {
    var report = this.getReport(error);
    var eventKey = this.getEventKey(debug_params);

    if (!this.errors[eventKey]) {
      this.errors[eventKey] = {
        tags: [],
        template: debug_params.template,
        messages: [report.msg],
        stackstrings: [report.stack]
      };
    } else {
      this.errors[eventKey].messages.push(report.msg);
      this.errors[eventKey].stackstrings.push(report.stack);
    }
  },

  /**
   * Public interface for event callbacks to enrich template errors captured 
   * by logError with additional tag data
   * @param {Object} tag_data 
   * @param {string} eventName
   * @param {number} eventId 
   */
  logTagError: function logTagError(tag_data, debug_params) {
    var eventKey = this.getEventKey(debug_params);
    var tagInfo = "Tag " + tag_data.id + " | " + tag_data.name;
    var errorObj = this.errors[eventKey];
    if (errorObj && errorObj.tags) errorObj.tags.push(tagInfo);else this.trackError(tagInfo, debug_params.triggering_event_name, null, null, null);
  },

  /**
   * Public interface for event callbacks to flush gathered logs
   * @param {string} eventName 
   * @param {number} eventId 
   */
  flushErrors: function flushErrors(debug_params) {
    var eventKey = this.getEventKey(debug_params);

    if (!this.errors[eventKey]) {
      _store("_data.error_archive." + eventKey, "no errors");

      return;
    }

    this.trackError((this.errors[eventKey].tags || []).join(" / "), debug_params && debug_params.triggering_event_name, this.errors[eventKey].template, (this.errors[eventKey].messages || []).join(" / "), (this.errors[eventKey].stackstrings || []).join(" / "));

    _store("_data.error_archive." + eventKey, this.errors[eventKey]);

    delete this.errors[eventKey];
  }
};
;// CONCATENATED MODULE: ./framework/2_system/Registry.js


var master_collection = ["index_0_unavailable"];

var assets_by_type = _store("_registered_assets", {});

var deleted_assets = [];
var classes = {};
var Registry = {
  get: function get(asset_desc) {
    if (!asset_desc) {
      _error("Asset description missing in Registry query");
    }

    if (_isNum(asset_desc)) {
      return master_collection[asset_desc];
    }
  },
  addItem: function addItem(item) {
    if (!item) {
      _error("Insufficient details for item registration in Registry");
    }

    return addItemByType(item.constructor.name, item) && addItemToMasterCollection(item);
  },
  registerClass: function registerClass(constructor) {
    classes[constructor.name] = constructor;
  },
  getClassDefinition: function getClassDefinition(constructor_name) {
    return classes[constructor_name];
  },
  deleteItem: function deleteItem(item_id) {
    if (!_isNum(item_id)) _error("Invalid item id in Registry");
    var item = master_collection.splice(item_id, 1, null)[0];
    var item_type = item.constructor.name;
    assets_by_type[item_type].splice(assets_by_type[item_type].indexOf(item), 1, null);
    deleted_assets.push(item);
  }
};

function addItemToMasterCollection(item) {
  var id = master_collection.push(item) - 1;
  return id;
}

function addItemByType(type, item) {
  return assets_by_type[type] = (assets_by_type[type] || []).concat(item);
}
;// CONCATENATED MODULE: ./framework/2_system/System.js



var callback_queue = [];
var timer;
var System_config;

function System_log(msg) {
  System.Logger.log(msg);
}

var System = {
  queue: function queue(callback) {
    if (!_getType_isFn(callback)) {
      _error("Only callbacks can be ququed");
    }

    callback_queue.push(callback);

    if (!timer) {
      timer = setTimeout(processCallbakcks);
    }
  }
};

System.addItem = function (item) {
  return Registry.addItem(item);
};

System.Logger = {
  log: function log(msg) {
    System_config = System_config || _get("config");

    if (System_config && System_config.debugMore) {
      console.error(msg);
    }
  }
};

function processCallbakcks() {
  timer = null;
  callback_queue.splice(0, callback_queue.length).forEach(function (callback) {
    callback();
  });
}
;// CONCATENATED MODULE: ./framework/2_system/index.js






var Storage = {
  _get: _get,
  _store: _store
};
;// CONCATENATED MODULE: ./framework/4_dataLayer/classes/DataLayerMessage.js


function DataLayerMessage(args) {
  this.end_result;
  this.content;
  this.event;
  this.raw;
  this.id;
  this.id = Registry.addItem(this);
  this.content = getContent(args);
  this.event = getEvent(args);
  this.raw = args;
}

DataLayerMessage.prototype.cancel = function () {
  this.end_result = "MESSAGE_CANCELLED";
};

DataLayerMessage.prototype.isCancelled = function () {
  return this.end_result == "MESSAGE_CANCELLED";
};

DataLayerMessage.prototype.getContent = function () {
  return this.content;
};

DataLayerMessage.prototype.getEvent = function () {
  return this.event;
};

function getContent(arguments_obj) {
  if (arguments_obj.length == 1) {
    return arguments_obj[0];
  }

  if (arguments_obj.length > 1) {
    return arguments_obj;
  }

  return "";
}

function getEvent(arguments_obj) {
  var getGtagEvent = function getGtagEvent(arguments_obj) {
    if (arguments_obj.length == 3 || arguments_obj[0] === "event") {
      return arguments_obj[1];
    }
  };

  if (arguments_obj.length == 1) {
    if (_isArguments(arguments_obj[0])) {
      return getGtagEvent(arguments_obj[0]);
    }

    return arguments_obj[0].event;
  }

  return getGtagEvent(arguments_obj);
}
;// CONCATENATED MODULE: ./framework/3_observers/classes/Listener.js


function Listener(fn, settings, observer) {
  this.id;
  this.name;
  this.listen_to_past;
  this.current_status;
  this.executable = fn;
  this.observer = observer;
  this.type = observer.type;
  this.registering_key;
  this.id = Registry.addItem(this);
  this.name = settings.name || fn.name || "";
  this.listen_to_past = settings.past_events;
  this.activation_event = settings.activation_event;
  this.execute_once = settings.execute_once;
}

Listener.prototype.setRegKey = function (key) {
  this.registering_key = key;
  return key;
};

Listener.prototype.isRemoved = function () {
  return this.current_status == "REMOVED";
};

Listener.prototype.setActive = function () {
  this.current_status = "ACTIVE";
};

Listener.prototype.execute = function () {
  try {
    var ret = this.executable.apply(null, arguments);

    if (this.execute_once) {
      this.remove();
    }

    return ret;
  } catch (err) {
    _error("Listener error ", err.message);
  }
};

Listener.prototype.remove = function () {
  if (this.current_status == "REMOVED") {
    _error("Listener has already been removed");
  }

  this.observer.removeListener(this.registering_key);
  this.current_status = "REMOVED";
};
;// CONCATENATED MODULE: ./framework/3_observers/classes/Observer.js


function Observer(observer_type) {
  this.registered_listeners = {};
  this.listener_count = 0;
  this.is_listening;
  this.type = observer_type;
  this.past_events = [];
}

Observer.prototype.startListening = function () {
  this.is_listening = true;
  this.doStartListening();
};

Observer.prototype.addListener = function (fn, settings_received) {
  if (!_getType_isFn(fn)) {
    _error("Type '" + _getType(fn) + "' is not a valid listener function.");
  }

  var listener = new Listener(fn, settings_received, this);
  var listener_key = listener.setRegKey(this.getListenerKey(listener.name));
  this.registered_listeners[listener_key] = listener;
  this.listener_count++;

  if (!this.is_listening) {
    this.startListening();
  }

  if (listener.listen_to_past) {
    this.processPastEvents(listener, this.past_events.length);
  }

  return listener;
};

Observer.prototype.addPastEvent = function (event) {
  this.past_events.push(event);
};

Observer.prototype.processPastEvents = function (listener, past_events_length) {
  for (var i = 0; i < past_events_length; i++) {
    if (listener.isRemoved()) return;
    var event_to_process = this.past_events[i];

    if (listener.activation_event && (!event_to_process || event_to_process.event !== listener.activation_event)) {
      continue;
    }

    listener.execute(event_to_process);
  }
};

Observer.prototype.getListenerKey = function (listener_name) {
  if (!listener_name || this.registered_listeners[listener_name]) {
    return [this.type, this.listener_count, listener_name || "anonym"].join("|");
  }

  return listener_name;
};

Observer.prototype.removeListener = function (reg_key) {
  if (!this.registered_listeners[reg_key]) _error("Listener to delete does not exist");
  delete this.registered_listeners[reg_key];
};

Observer.prototype.executeListeners = function (args) {
  for (var listener_key in this.registered_listeners) {
    var listener = this.registered_listeners[listener_key];

    if (listener.activation_event && (!args || args.event !== listener.activation_event)) {
      continue;
    }

    listener.execute(args);
  }

  this.addPastEvent(args);
};
;// CONCATENATED MODULE: ./framework/3_observers/DataLayerPushObserver.js


var reassigned_pushes = [];
var message_handler;
var callbacks = {};

function PushObserver() {
  Observer.call(this, "data_layer_push");
  this.is_listening = true;
  var dl_observer = this;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(function () {
    for (var attr in window.google_tag_manager) {
      if (window.google_tag_manager[attr].dataLayer && window.google_tag_manager[attr].dataLayer.get === this.get && attr.indexOf("-") > 1) {
        replacePush(attr, dl_observer);
      }
    }
  });
}

function replacePush(container_id, dl_observer) {
  var push_data = addReassignedPush(container_id);

  function isTopmostPush() {
    return push_data.offset + 1 == reassigned_pushes.length;
  }

  push_data.updated_fn = window.dataLayer.push = function () {
    if (isTopmostPush()) {
      dl_observer.handleMessage(arguments, push_data.original_fn);
    } else return dl_observer.forward(push_data.original_fn, arguments);
  };
}

function addReassignedPush(container_id) {
  var push_data = {
    "target_id": container_id,
    "original_fn": window.dataLayer.push,
    "offset": reassigned_pushes.length
  };
  reassigned_pushes.push(push_data);
  return push_data;
}

PushObserver.prototype = (Object.create || objectCreate)(Observer.prototype);
PushObserver.prototype.constructor = PushObserver; // @todo: refactor!!!

PushObserver.prototype.addCallback = function (fn, settings) {
  var event_exists = window.dataLayer.find(function (msg) {
    return msg && msg.event == settings.activation_event || msg && msg[0] && msg[0].event == settings.activation_event;
  });
  if (event_exists) return fn();
  var key = settings.activation_event.replace(/\./gi, "_");
  callbacks[key] = callbacks[key] || [];
  callbacks[key].push(fn);
};

PushObserver.prototype.forward = function (ancestor, args) {
  ancestor.apply(window.dataLayer, args);
};

PushObserver.prototype.submitPrimaryMessage = function (args) {
  var push_fn = reassigned_pushes.length ? reassigned_pushes.slice(-1)[0].original_fn : window.dataLayer.push;
  if( _isArguments(args[0])) return push_fn.apply(window.dataLayer, args);
  else push_fn( args );
};

PushObserver.prototype.handleMessage = function (args, forward_fn) {
  if (!message_handler) {
    return this.forward(forward_fn, args);
  }

  var event_name = args && args.event || args && args[0] && args[0].event || "";
  var key = event_name.replace(/\./gi, "_");
  if (callbacks[key]) callbacks[key].forEach(function (fn) {
    fn();
  });
  delete callbacks[key];
  return message_handler.handleMessage(args, forward_fn);
};

PushObserver.prototype.setMessageHandler = function (message_handler_in) {
  return message_handler = message_handler_in;
};

Observer.prototype.processPastEvents = function (listener) {
  for (var i = 0; i < window.dataLayer.length; i++) {
    if (listener.isRemoved()) return;
    var event_to_process = window.dataLayer[i];

    if (listener.activation_event && (!event_to_process || event_to_process.event !== listener.activation_event)) {
      continue;
    }

    listener.execute(event_to_process);
  }
};

var DataLayerPushObserver = new PushObserver();
;// CONCATENATED MODULE: ./framework/3_observers/LifeCycleEventObserver.js



function LifeCycleObserver() {
  Observer.call(this, "life_cycle_event");
  this.startListening();
}

LifeCycleObserver.prototype = (Object.create || objectCreate)(Observer.prototype);
LifeCycleObserver.prototype.constructor = LifeCycleObserver;

LifeCycleObserver.prototype.doStartListening = function () {
  LifeCycleHandler.addObserver(this);
};

LifeCycleObserver.prototype.handleEvent = function (event_data) {
  this.executeListeners(event_data);
};

var LifeCycleEventObserver = new LifeCycleObserver();
;// CONCATENATED MODULE: ./framework/3_observers/AjaxObserver.js


function AjaxHandler() {
  Observer.call(this, "ajax");
  this.send_original = XMLHttpRequest.prototype.send;
}

AjaxHandler.prototype = (Object.create || objectCreate)(Observer.prototype);
AjaxHandler.prototype.constructor = AjaxHandler;

AjaxHandler.prototype.doStartListening = function () {
  var request_observer = this;

  XMLHttpRequest.prototype.send = function () {
    var onload_original = this.onload;

    this.onload = function (event) {
      return request_observer.handleMessage(event, onload_original, this);
    };

    return request_observer.send_original.apply(this, [].slice.call(arguments, 0));
  };
};

AjaxHandler.prototype.handleMessage = function (event, onload_original, xml_req_instance) {
  if (_isFn(onload_original)) {
    onload_original.call(xml_req_instance, event);
  }

  this.executeListeners(event);
};

var AjaxObserver = new AjaxHandler();
;// CONCATENATED MODULE: ./framework/3_observers/ClickObserver.js


function ClickObserverClass() {
  Observer.call(this, "click");
  this.startListening();
}

ClickObserverClass.prototype = (Object.create || objectCreate)(Observer.prototype);
ClickObserverClass.prototype.constructor = ClickObserverClass;

ClickObserverClass.prototype.doStartListening = function () {
  document.addEventListener("click", this.handleClickEvent.bind(this));
};

ClickObserverClass.prototype.handleClickEvent = function (event) {
  this.executeListeners(event);
};

var ClickObserver = new ClickObserverClass();
;// CONCATENATED MODULE: ./framework/3_observers/_module/ObserverModule.js


function ObserverModule_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function ObserverModule_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ObserverModule_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ObserverModule_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }






var ObserverModule_ObserverModule = {
  addPushListener: function addPushListener(fn, name) {
    var settgins = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return DataLayerPushObserver.addListener(fn, ObserverModule_objectSpread({
      name: name
    }, settgins));
  },
  addPushCallback: function addPushCallback(fn, event_name) {
    return DataLayerPushObserver.addCallback(fn, {
      "activation_event": event_name,
      "execute_once": true,
      "past_events": true
    });
  },
  setPushMessageHandler: function setPushMessageHandler(controller) {
    return DataLayerPushObserver.setMessageHandler(controller) && DataLayerPushObserver;
  },
  addAjaxListener: function addAjaxListener(fn, name) {
    return AjaxObserver.addListener(fn, {
      "name": name
    });
  },
  addClickListener: function addClickListener(fn, name) {
    return ClickObserver.addListener(fn, {
      "name": name
    });
  },
  addLifeCycleListener: function addLifeCycleListener(life_cycle_event, fn, name, listen_to_past) {
    return LifeCycleEventObserver.addListener(fn, {
      "activation_event": life_cycle_event,
      "name": name,
      "past_events": _exists(listen_to_past)
    });
  }
};
;// CONCATENATED MODULE: ./framework/4_dataLayer/SpamFilter.js

function spamFilter(message) {
  var msg = message.getContent();
  var is_spam = false;
  if (!msg) is_spam = true;else if (_isArguments(msg)) {
    if (!msg.length || _contains_contains(["consent", "set"], msg[0])) {
      is_spam = true;
    }
  } else if (msg["developer_id.dMWZhNz"]) {
    is_spam = true;
  }

  if (is_spam) {
    message.cancel();
  }
}
;// CONCATENATED MODULE: ./framework/4_dataLayer/MessageRouter.js



var cancelled_messages = [];
var push_observer;

function initialize() {
  push_observer = ObserverModule_ObserverModule.setPushMessageHandler(this);
  ObserverModule_ObserverModule.addPushListener(spamFilter);
}

function handleMessage(args, forward_fn) {
  var message = new DataLayerMessage(args);
  push_observer.executeListeners(message);

  if (!message.isCancelled()) {
    push_observer.forward(forward_fn, args);
  } else cancelled_messages.push(message);
}

function submitPrimaryMessage() {
  setTimeout(function (msg) {
    push_observer.submitPrimaryMessage(msg);
  }(arguments));
}
var MessageRouter = {
  initialize: initialize,
  handleMessage: handleMessage
};
;// CONCATENATED MODULE: ./framework/4_dataLayer/consent-mode/ConsentModeManager.js


var ConsentModeManager_config;
var state_denied = {
  'ad_storage': 'denied',
  'analytics_storage': 'denied'
};
var state_granted = {
  'ad_storage': 'granted',
  'analytics_storage': 'granted'
};
var consentStateUpdate = function consentStateUpdate(old_consent, new_consent) {
  ConsentModeManager_config = ConsentModeManager_config || _get("config");
  if (!ConsentModeManager_config.consentModeIsEnabled) return;
  var storage_states = getStateVars(old_consent, new_consent);
  if (storage_states) submitPrimaryMessage("consent", "update", storage_states);
};

function getStateVars(old_consent, new_consent) {
  switch (getChangeType(old_consent, new_consent)) {
    case "denied":
      return state_denied;

    case "granted":
      return state_granted;
  }
}

function getChangeType() {
  var old_consent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var new_consent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var has_consent = hasConsent(new_consent);
  var had_consent = hasConsent(old_consent);
  if (has_consent && !had_consent) return "granted";
  if (!has_consent && had_consent) return "denied";
}

function hasConsent(formatted_consent) {
  return formatted_consent.indexOf("statistics") > -1;
}
;// CONCATENATED MODULE: ./framework/4_dataLayer/user-consent/RedirectionHandler.js

var RedirectionHandler = {
  redirect: function redirect() {
    var loc = _addQueries(document.location.href, {
      "ref-original": document.referrer
    });

    document.location.replace(loc);
  },
  isRedirectedLandingPage: function isRedirectedLandingPage() {
    return document.location && String(document.location.href).indexOf("ref-original=") > -1;
  }
};
;// CONCATENATED MODULE: ./framework/4_dataLayer/user-consent/CookiebotHelper.js




var is_consent_screen;
var CookiebotHelper_config;
var CookiebotHelper = {
  initialize: function initialize() {
    CookiebotHelper_config = _get("config");
    if (!CookiebotHelper_config.GDPRConsentProvider == "cookiebot") return;

    window.CookiebotCallback_OnDialogDisplay = function () {
      is_consent_screen = _store("is_consent_screen", true);
    };

    ObserverModule_ObserverModule.addPushListener(cookiebotPreprocessor);
    setInitialConsentState(CookiebotHelper_config.utils.getCookiebotConsentState());
  }
};

function getConsentFromWindowObject() {
  return Object.keys(window.Cookiebot.consent || {}).filter(function (elem) {
    return window.Cookiebot.consent[elem] === true && _contains_contains(ConsentManager.supported_consent_categories, elem);
  });
}

function cookiebotPreprocessor(message) {
  if ((message.getEvent() || "").indexOf("cookie_consent_") !== 0) return;
  message.cancel();
  var accepted_consent_categories = getConsentFromWindowObject();

  if (!accepted_consent_categories.length) {
    accepted_consent_categories = CookiebotHelper_config.utils.getCookiebotConsentState();
  }

  submitConsent(accepted_consent_categories);
}
;// CONCATENATED MODULE: ./framework/4_dataLayer/user-consent/ConsentManager.js






var supported_consent_categories = ["statistics", "marketing"];
var consent;
var ConsentManager_config;
var ConsentManager = {
  supported_consent_categories: supported_consent_categories,
  initialize: ConsentManager_initialize
};

function ConsentManager_initialize() {
  ConsentManager_config = _get("config");

  switch (ConsentManager_config.GDPRConsentProvider) {
    case undefined:
    case "none":
      return setInitialConsentState(supported_consent_categories);

    case "cookiebot":
      return CookiebotHelper.initialize();
  }
}

function submitConsent(accepted_categories_array) {
  var new_consent = getFormattedConsent(accepted_categories_array);
  var old_consent = consent;
  if (consent === new_consent) return;
  consent = _store("consent", new_consent);

  if (ConsentManager_config.consentModeIsEnabled) {
    consentStateUpdate(old_consent, new_consent);
  }

  LifeCycleHandler.pushEvent({
    event: "consent_update",
    consent: consent
  });

  if (_get("is_consent_screen") && ConsentManager_config.is_UI_customization_present && _contains_contains(accepted_categories_array, "statistics")) {
    return RedirectionHandler.redirect();
  }
}
function setInitialConsentState(accepted_categories_array) {
  consent = _store("consent", getFormattedConsent(accepted_categories_array));

  _store("is_redirected_consent_screen", RedirectionHandler.isRedirectedLandingPage());
}

function getFormattedConsent(accepted_categories_array) {
  if (!_isArray(accepted_categories_array)) {
    _error("Accepted consent categories should be submitted in array format");
  }

  if (accepted_categories_array.find(function (category) {
    return !_contains_contains(supported_consent_categories, category);
  })) {
    _error("Unsupported consent category submitted");
  }

  return accepted_categories_array.join("|");
}
;// CONCATENATED MODULE: ./framework/4_dataLayer/HitReleaseHandler.js



var inner_queue = [];
var inner_past = [];
var processing_inner_queue;
var page_view_received;
var start_received;
function HitReleaseHandler_initialize() {
  ObserverModule.addLifeCycleListener("consent_update", processQueue, "hitrelease", false);
}
function submitHitEvent(event) {
  if (event.consent_mode_priotity_event) {
    sendEvent(event);
  } else if (event.name === "page_view") {
    page_view_received = true;
    queueAfterStart(event);
  } else if (event.name === "__lets_start__") {
    start_received = true;
    inner_queue.unshift(event);
  } else {
    inner_queue.push(event);
  }

  if (!processing_inner_queue) processQueue();
}

function queueAfterStart(event) {
  if (!start_received) return inner_queue.unshift(event);
  var index = inner_queue.indexOf(event);
  inner_queue.splice(index, 0, event);
}

function sendEvent(event) {
  inner_past.push(event);
  submitPrimaryMessage("event", event.name, event.getAttributes());
}

function processQueue() {
  if (!_get("consent") || !start_received || !page_view_received || processing_inner_queue) {
    return;
  }

  processing_inner_queue = true;

  while (inner_queue.length) {
    var event = inner_queue.shift();
    sendEvent(event);
  }

  processing_inner_queue = false;
}
;// CONCATENATED MODULE: ./framework/4_dataLayer/_module/DataLayerController.js




function DataLayerController_initialize() {
  MessageRouter.initialize();
  ConsentManager.initialize();
}

var DataLayerController = {
  initialize: DataLayerController_initialize,
  submitHitEvent: submitHitEvent,
  submitPrimaryMessage: submitPrimaryMessage
};
;// CONCATENATED MODULE: ./framework/6_events/classes/Attribute.js


var ATTRIBUTE_TYPES = {
  "CONSTANT": "attr_const",
  "CSS_SELECTOR": "css_selector",
  "JS_FUNCTION": "js_function",
  "DATALAYER_VARIABLE": "dataLayer_var"
};
function Attribute(attribute_name, attribute_type, raw_value, owner) {
  this.attribute_name;
  this.attribute_type;
  this.owner_entity;
  this.cached_value;
  this.is_cachable;
  this.raw_value;
  if (!_isStr(attribute_name)) _error("Attribute name should be a string");
  if (!_isStr(attribute_type) || !ATTRIBUTE_TYPES[attribute_type]) _error("Invalid Attribute type");
  this.attribute_name = attribute_name;
  this.attribute_type = attribute_type;
  this.raw_value = raw_value;
  this.owner_entity = owner;
  this.is_cachable = true;
}

Attribute.prototype.getValue = function () {
  if (!this.is_cachable) {
    return doGetValue(this);
  }

  if (!this.cached_value) {
    this.cached_value = getCachedValue(doGetValue(this));
  }

  return this.cached_value.value;
};

Attribute.prototype.doNotCache = function () {
  return (this.is_cachable = false) || this;
};

function getCachedValue(value_to_cache) {
  return _exists(value_to_cache) ? {
    value: value_to_cache
  } : {};
}

function doGetValue(attribute_instance) {
  switch (attribute_instance.attribute_type) {
    case "CONSTANT":
      return attribute_instance.raw_value;

    case "JS_FUNCTION":
      return _run(attribute_instance.raw_value, attribute_instance.owner_entity && attribute_instance.owner_entity.id);

    case "DATALAYER_VARIABLE":
      return getDataLayerVariable(attribute_instance.raw_value);

    case "CSS_SELECTOR":
      return _run(getElementText, attribute_instance);
  }
}

function getDataLayerVariable(variable_path) {
  return window.google_tag_manager[config.baseContainerId].dataLayer.get(variable_path);
}

function getElementText(attribute_instance) {
  var context_node = getContextNode(attribute_instance);
  var attribute_name = attribute_instance.attribute_name;
  var selector = attribute_instance.raw_value;

  if (!(context_node instanceof Element)) {
    _error("Attribute context node should be an Element");
  }

  var element = _getSingleNode(selector, context_node);

  return element && getFormattedValue(attribute_name, element);
}

function getContextNode(attribute_instance) {
  return attribute_instance.owner_entity && attribute_instance.owner_entity.wrapper;
}

function getFormattedValue(key, element) {
  var text = _getElementText(element);

  if (_contains_contains(["item_quantity", "quantity", "index"], key)) {
    return parseInt(text);
  } else if (_contains_contains(["discount", "price", "value"], key)) {
    return _getNumber_getNumber(text);
  }

  return text;
}
;// CONCATENATED MODULE: ./framework/6_events/classes/AttributeHandler.js


function AttributeHandler() {
  this.attributes = {};
}

AttributeHandler.prototype.addAttributeObject = function (obj) {
  if (!(obj instanceof Attribute)) {
    _error("Attribute object is not an attribte instance");
  }

  if (obj.attribute_name in this.attributes) {
    _error("Attribute with the given name has already been added");
  }

  return (this.attributes[obj.attribute_name] = obj) && obj;
};

AttributeHandler.prototype.addAttribute = function (name, type, value) {
  if (name in this.attributes) {
    _error("Attribute with the given name has already been added");
  }

  this.attributes[name] = new Attribute(name, type, value, this);
  return this.attributes[name];
};

AttributeHandler.prototype.addOrUpdateAttribute = function (name, type, value) {
  this.attributes[name] = new Attribute(name, type, value, this);
  return this.attributes[name];
};

AttributeHandler.prototype.getAttribute = function (attribute_key) {
  if (attribute_key in this.attributes) return this.attributes[attribute_key].getValue();
};

AttributeHandler.prototype.getAttributes = function () {
  return Object.keys(this.attributes).reduce(function (all, current) {
    var current_value = this.attributes[current].getValue();
    return _exists(current_value) && (all[current] = current_value) && all || all;
  }.bind(this), {});
};

AttributeHandler.prototype.merge = function (attributes_obj) {
  for (var attr_name in attributes_obj) {
    if (!(attr_name in this.attributes)) {
      this.addAttribute(attr_name, "CONSTANT", attributes_obj[attr_name]);
    }
  }

  return this;
};
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
;// CONCATENATED MODULE: ./framework/6_events/general-attributes/Experiment.js



/**
 * @name experiment_data
 * @type {EventAttribute}
 * @attribute_type Event dimension
 * @desc This attribute contains `experiment_id` and `experiment_variant_id` concatinated by comma
 */

/**
 * @name experiment_tool
 * @type {EventAttribute}
 * @attribute_type dimension
 * @desc The name of the tool that was used to deliver the experiment
 */

var experiment_data_cached;
var Experiment = {
  attr_name: "experiment",
  initialize: function initialize() {
    CommonAttributeManager.register(this);
  },
  getAttribute: function getAttribute() {
    addCallback();
    return new Attribute(this.attr_name, "JS_FUNCTION", getOptimizeExperiment);
  }
};

function addCallback() {
  DataLayerController.submitPrimaryMessage('event', 'optimize.callback', {
    callback: getExperiments
  });
}

function getExperiments(value, name) {
  experiment_data_cached = [name, value].join(".");
}

function getOptimizeExperiment() {
  return experiment_data_cached;
}
;// CONCATENATED MODULE: ./framework/6_events/general-attributes/SharedClientId.js



/**
 * @name shared_client_id
 * @type {EventAttribute}
 * @attribute_type dimension
 * @desc A shared user identifier that takes the same value across platform. By default it is the value of the Google client_id
 */

var SharedClientId = {
  attr_name: "shared_client_id",
  initialize: function initialize() {
    CommonAttributeManager.register(this);
  },
  getAttribute: function getAttribute() {
    return new Attribute(this.attr_name, "JS_FUNCTION", getGaClientIdFromCookie);
  }
};

function getGaClientIdFromCookie() {
  var _ga_cookie_value = _getCookie("_ga");

  if (_ga_cookie_value) {
    return _ga_cookie_value.split(".").slice(-2).join(".");
  }
}
;// CONCATENATED MODULE: ./framework/6_events/general-attributes/SharedSessionId.js




/**
 * @name shared_session_id
 * @type {EventAttribute}
 * @attribute_type dimension
 * @desc A shared session identifier that takes the same value across platform. By default it is the value of the Google session_id
 */

var SharedSessionId = {
  attr_name: "shared_session_id",
  initialize: function initialize() {
    CommonAttributeManager.register(this);
  },
  getAttribute: function getAttribute() {
    return new Attribute(this.attr_name, "JS_FUNCTION", getGa4SessionIdFromCookie);
  }
};

function getGa4SessionIdFromCookie() {
  var config = _get("config");

  var ga4_ids = (config.tracking_pixels.ga4 || []).map(function (p) {
    return p.getPixelAttributes();
  });

  for (var i in ga4_ids) {
    var session_cookie_name = "_ga_" + ga4_ids[i].replace("G-", "");

    var session_cookie = _getCookie(session_cookie_name);

    if (session_cookie) {
      return session_cookie.split(".")[2];
    }
  }
}
;// CONCATENATED MODULE: ./framework/6_events/general-attributes/ProportionalDepth.js


/**
 * @name proportional_depth
 * @type {EventAttribute}
 * @attribute_type metric, number, floating point, 1 digit precision
 * @desc Distance of the top of the viewport form the top of the webpage porportional to viewport hegiht
 */

var ProportionalDepth = {
  "attr_name": "proportional_depth",
  initialize: function initialize() {
    CommonAttributeManager.register(this);
  },
  getAttribute: function getAttribute() {
    return new Attribute(this.attr_name, "JS_FUNCTION", getProportionalDepth).doNotCache();
  }
};

function getProportionalDepth() {
  return (window.pageYOffset / document.documentElement.clientHeight).toFixed(1);
}
;// CONCATENATED MODULE: ./framework/6_events/general-attributes/CommonAttributeManager.js






var registered_attributes = {};
var CommonAttributeManager_config;
var CommonAttributeManager = {
  initialize: function initialize() {
    CommonAttributeManager_config = _get("config"); // @todo refactor!!!

    Experiment.initialize();
    SharedClientId.initialize();
    SharedSessionId.initialize();
    ProportionalDepth.initialize();
  },
  execute: function execute(event) {
    for (var attr_name in registered_attributes) {
      event.addAttributeObject(registered_attributes[attr_name]);
    }
  },
  register: function register(manager) {
    if (!_usagePermissionGranted(manager.attr_name, CommonAttributeManager_config.attribute_permissions)) {
      return false;
    }

    return addAttribute(manager.getAttribute());
  }
};

function addAttribute(attribute) {
  if (attribute.attribute_name in registered_attributes) {
    _error("Attribute definition with the given name already exists");
  }

  registered_attributes[attribute.attribute_name] = attribute;
}
;// CONCATENATED MODULE: ./framework/6_events/standardization/_Standardizer.js


var generic_standardizers = {};
var Standardizer = {
  addGenericStandardizer: function addGenericStandardizer(platform, instance) {
    if (generic_standardizers[platform]) {
      _error("Ecom standardizer for platform already exists");
    }

    generic_standardizers[platform] = instance;
  },
  execute: function execute(event) {
    if (event.constructor.name === "EcomEvent") {
      processStandardizers(event.standardization_handlers.ecom.getAvailableStandardizers(), event);
    } else {
      processStandardizers(generic_standardizers, event);
    }
  }
};

function processStandardizers(available_standardizers, event) {
  var event_attributes = event.getAttributes();

  for (var platform in available_standardizers) {
    if (platform in event.tracking_pixels) {
      processPlatform(available_standardizers, platform, event_attributes, event);
    }
  }
}

function processPlatform(available_standardizers, platform, event_attributes, event) {
  var standardizer = available_standardizers[platform];
  var std_event_name = standardizer.getEventName(event);
  var std_attributes = standardizer.getAttributes(event_attributes, event);
  var storage_root_base = "standard_event_values." + event.id + "." + platform;

  if (std_event_name) {
    _store(storage_root_base + ".event_name", std_event_name);
  }

  if (std_attributes) {
    _store(storage_root_base + ".attributes", std_attributes);
  }
}
;// CONCATENATED MODULE: ./framework/6_events/classes/DataLayerEvent.js


function DataLayerEvent_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function DataLayerEvent_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? DataLayerEvent_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : DataLayerEvent_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }


function DataLayerEvent(regular_event) {
  this.name;
  this.consent_mode_priotity_event;
  AttributeHandler.call(this);
  this.name = regular_event.name;
  this.attributes = DataLayerEvent_objectSpread({}, regular_event.attributes);
}
DataLayerEvent.prototype = (Object.create || objectCreate)(AttributeHandler.prototype);
DataLayerEvent.prototype.constructor = DataLayerEvent;
;// CONCATENATED MODULE: ./framework/6_events/dispatch/PixelDistributionHelper.js


var PixelDistributionHelper_config;
var getPixelDistribution = function getPixelDistribution(all_pixels, event) {
  PixelDistributionHelper_config = PixelDistributionHelper_config || _get("config");
  return Object.keys(all_pixels).reduce(function (current_round, platform, i, all_platforms) {
    if (!_usagePermissionGranted(platform, event.tracking_options)) {
      delete all_pixels[platform];
      return current_round;
    }

    if (!platformCanProcessEvent(event.name, platform)) {
      delete all_pixels[platform];
      return current_round;
    }

    if (!_get("consent") && PixelDistributionHelper_config.consentModeIsEnabled && consentModePixelsRemain(all_platforms)) {
      if (!_usagePermissionGranted(platform, {
        whitelist: PixelDistributionHelper_config.defaults.consent_mode_platforms
      })) {
        return current_round;
      }

      event.consent_mode_priotity_event = true;
    }

    if (PixelDistributionHelper_config.consentModeIsEnabled && event.name === "page_view" && _get("is_redirected_consent_screen") && _get("consent")) {
      if (!_usagePermissionGranted(platform, {
        blacklist: PixelDistributionHelper_config.defaults.consent_mode_platforms
      })) {
        delete all_pixels[platform];
        return current_round;
      }
    }

    addPixels(current_round, all_pixels, platform, event);
    return current_round;
  }, {});
};

function addPixels(current_round, all_pixels, platform, event) {
  if (_contains_contains(["gua", "ga4"], platform)) {
    addAllPixels(current_round, all_pixels, platform, event);
    current_round[platform] = current_round[platform].map(function (info) {
      return info.pixel;
    });
    return;
  }

  if (platform === "fb") {
    addAllPixels(current_round, all_pixels, platform, event);
    current_round.fb = current_round.fb.map(function (info) {
      return info.pixel;
    }).join(",");
    return;
  }

  addOnePixel(current_round, all_pixels, platform, event);
  current_round[platform] = current_round[platform].pixel;
}

function consentModePixelsRemain(all_platforms) {
  return all_platforms.find(function (platform) {
    return PixelDistributionHelper_config.defaults.consent_mode_platforms.indexOf(platform) > -1;
  });
}

function platformCanProcessEvent(event_name, platform) {
  return !PixelDistributionHelper_config.defaults.limited_platforms[platform] || _usagePermissionGranted(event_name, PixelDistributionHelper_config.limited_platforms[platform]);
}

function addAllPixels(current_round, all_pixels, platform, event) {
  current_round[platform] = all_pixels[platform].reduce(function (target_array, pixel_obj) {
    var attributes = pixel_obj.getAttributes(event.name, event.getAttributes());

    if (attributes) {
      target_array.push({
        side: pixel_obj.measurement_side,
        pixel: attributes
      });
    }

    return target_array;
  }, []);
  delete all_pixels[platform];
  return current_round;
}

function addOnePixel(current_round, all_pixels, platform, event) {
  var attributes = false;

  do {
    var pixel_obj = all_pixels[platform].shift();
    attributes = pixel_obj.getAttributes(event.name, event.getAttributes());

    if (attributes) {
      current_round[platform] = {
        side: pixel_obj.measurement_side,
        pixel: attributes
      };
    }
  } while (!attributes && all_pixels[platform].length);

  if (!all_pixels[platform].length) delete all_pixels[platform];
  return current_round;
}
;// CONCATENATED MODULE: ./framework/6_events/dispatch/EventReleaseHandler.js



function EventReleaseHandler_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function EventReleaseHandler_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? EventReleaseHandler_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : EventReleaseHandler_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }







var EventReleaseHandler_config;
var EventReleaseHandler = {
  execute: function execute(original_event) {
    EventReleaseHandler_config = EventReleaseHandler_config || _get("config");

    if (original_event.name === "__lets_start__") {
      return DataLayerController.submitHitEvent(new DataLayerEvent(original_event));
    }

    var all_pixels = getPixelsCopy(original_event.name);
    CommonAttributeManager.execute(original_event);
    Standardizer.execute(original_event);

    var _loop = function _loop() {
      if (noPixelsLeft(all_pixels)) return {
        v: void 0
      };
      var event = new DataLayerEvent(original_event);
      var current_round_pixels = getPixelDistribution(all_pixels, event);
      if (!Object.keys(current_round_pixels).length) return "continue";
      var send_to = ["ga4", "gua"].reduce(function (send_to, platform) {
        return current_round_pixels[platform] ? send_to.concat(current_round_pixels[platform]) : send_to;
      }, []);
      event.addAttribute("send_to", "CONSTANT", send_to);
      event.addAttribute("event_metadata", "CONSTANT", {
        ast_id: original_event.id,
        iteration_index: iteration_index,
        client_pixels: current_round_pixels
      });
      DataLayerController.submitHitEvent(event);
    };

    for (var iteration_index = 0; iteration_index < 5; iteration_index++) {
      var _ret = _loop();

      if (_ret === "continue") continue;
      if (_typeof(_ret) === "object") return _ret.v;
    }
  }
};

function getPixelsCopy(event_name) {
  var pixel_config = EventReleaseHandler_objectSpread(EventReleaseHandler_objectSpread({}, EventReleaseHandler_config.tracking_pixels), _get("config.conversions." + event_name) || {});

  return Object.keys(pixel_config).reduce(function (all, platform) {
    all[platform] = (all[platform] || []).concat(pixel_config[platform]);
    return all;
  }, {});
}

function getCurrentStandards(pixels, event_id) {// return config.debugMode && StandardHelper.getFilteredStandards( pixels, event_id ) || {};
}

function noPixelsLeft(pixels_obj) {
  return !Object.keys(pixels_obj).length;
}
;// CONCATENATED MODULE: ./framework/7_tagging/AssetHandler.js

var AssetHandler = {
  known_elements: [],
  triggers: {
    "all": {},
    "click": {},
    "visibility": {}
  },
  getElementIndex: function getElementIndex(element) {
    var index = this.known_elements.indexOf(element);
    return index > -1 ? index : _log("Element not found in known elements");
  }
};
;// CONCATENATED MODULE: ./framework/7_tagging/TriggerMappingHandler.js




var TriggerMappingHandler_config;
var listeners_added = {
  "VISIBILITY": false,
  "CLICK": false
};
var TriggerMappingHandler = {
  setupTrigger: function setupTrigger(trigger) {
    if (!trigger || !trigger.elements.length) {
      return _log("Insufficient trigger provided for tagging");
    }

    TriggerMappingHandler_config = TriggerMappingHandler_config || _get("config");

    switch (trigger.type) {
      case "VISIBILITY":
        addTriggerToElements(trigger);
        break;

      case "CLICK":
        addClickTracking(trigger);
        break;

      default:
        _error("Invalid Trigger type to map");

    }

    if (!listeners_added[trigger.type]) {
      addListener(trigger.type);
      listeners_added[trigger.type] = true;
    }
  },
  getLastIncludedElementIndex: getLastIncludedElementIndex
};

function addListener(type) {
  if (type == "VISIBILITY") ObserverModule_ObserverModule.addPushListener(TaggedVisibilityListener);
  if (type == "CLICK") ObserverModule_ObserverModule.addClickListener(TaggedClickListener);
}

function addTriggerToIndex(trigger, element, index) {
  var type = trigger.type.toLowerCase();
  AssetHandler.triggers[type][index] = trigger;
  AssetHandler.triggers.all[index] = trigger;

  if (type === "visibility") {
    element.setAttribute(TriggerMappingHandler_config.element_visibility_attribute, index);
  }
}

function addTriggerToElements(trigger) {
  trigger.elements.forEach(function (elem) {
    addTriggerToIndex(trigger, elem, AssetHandler.getElementIndex(elem));
  });
}

function addClickTracking(trigger) {
  if (!trigger.wrapper) {
    addTriggerToElements(trigger);
  } else addClickTrackingWithWrapper(trigger);
}

function addClickTrackingWithWrapper(trigger) {
  var trigger_opening_index = AssetHandler.getElementIndex(trigger.wrapper);
  var trigger_closing_index = getLastIncludedElementIndex(trigger.wrapper);

  for (var i = trigger_opening_index; i < trigger_closing_index + 1; i++) {
    addTriggerToIndex(trigger, null, index);
  }
}

function getLastIncludedElementIndex(elem) {
  if (elem.nextElementSibling) return AssetHandler.getElementIndex(elem.nextElementSibling) - 1;
  return getLastIncludedElementIndex(elem.parentElement);
}
;// CONCATENATED MODULE: ./framework/7_tagging/ElementHandler.js



var ElementHandler = {
  createKnownElementsReference: function createKnownElementsReference() {
    AssetHandler.known_elements.push.apply(AssetHandler.known_elements, _getNodesArray("*", document.body));
  },
  getVisibilityTrigger: function getVisibilityTrigger(trigger_id) {
    return AssetHandler.triggers.visibility[trigger_id] || _error("Trigger not found for provided id");
  },
  getClickTrigger: function getClickTrigger(element) {
    if (!_isHtmlElement(element)) {
      _error("getClickTrigger only accepts HTML elements as argument");
    }

    return AssetHandler.triggers.click[AssetHandler.getElementIndex(element)];
  }
};
;// CONCATENATED MODULE: ./framework/7_tagging/TaggingHandler.js




var dom_ready, assistant_ready;
var registered_tagging_handlers = {};
var accepted_handler_types = ["ecom", "click"];
var TaggingHandler = {
  scheduleTagging: function scheduleTagging() {
    if (window.gtm_assistant) assistant_ready = true;else document.addEventListener("gtm_assistant_ready", function registerAssistantReady() {
      assistant_ready = true;
      checkConditions();
    });
    ObserverModule_ObserverModule.addPushCallback(registerDomReady, "gtm.dom");
  },
  addTaggingRequest: function addTaggingRequest(type, handler) {
    if (!_contains_contains(accepted_handler_types, type)) {
      _error("Tagging handler type ", type, " is not supported.");
    }

    if (!handler) {
      _error("Handler missing from tagging request");
    }

    if (!_getType_isFn(handler.execute)) {
      _error("Tagging handler should have an execute method.");
    }

    registered_tagging_handlers[type] = handler;
  }
};

function checkConditions() {
  if (dom_ready && assistant_ready) setTimeout(execute);
}

function registerDomReady() {
  dom_ready = true;
  checkConditions();
}

function execute() {
  ElementHandler.createKnownElementsReference();
  LifeCycleHandler.pushEvent({
    "event": "tagging_module.before_tagging"
  });
  accepted_handler_types.forEach(function initiateTagging(tagging_type) {
    if (registered_tagging_handlers[tagging_type]) {
      registered_tagging_handlers[tagging_type].execute();
    }
  }); // trigger assistant re-indexing not notice freshly added attributes

  document.body.append(document.createElement("span"));
}
;// CONCATENATED MODULE: ./framework/7_tagging/_module/TaggingController.js




var TaggingController = {
  scheduleTagging: function scheduleTagging() {
    TaggingHandler.scheduleTagging();
  },
  addTaggingRequest: function addTaggingRequest(tagging_type, handler) {
    TaggingHandler.addTaggingRequest(tagging_type, handler);
  },
  setupTrigger: function setupTrigger(trigger) {
    return TriggerMappingHandler.setupTrigger(trigger);
  },
  getLastIncludedElementIndex: function getLastIncludedElementIndex(element) {
    if (!_isHtmlElement(element)) {
      _error("Last included element index can only be provided for Elements");
    }

    return TriggerMappingHandler.getLastIncludedElementIndex(element);
  },
  getKnownElements: function getKnownElements() {
    return AssetHandler.known_elements;
  },
  getTriggerMapping: function getTriggerMapping() {
    return AssetHandler.triggers;
  }
};
;// CONCATENATED MODULE: ./framework/6_events/classes/Trigger.js





var trigger_types = {
  "PAGE_VIEW": 1,
  "CALLBACK": 2,
  "DATALAYER_EVENT": 3,
  "VISIBILITY": 4,
  "CLICK": 5
};
var trigger_states = {
  "CREATED": 1,
  "ACTIVATED": 2,
  "INACTIVE": 3,
  "FIRED": 4
};
function Trigger(settings) {
  this.id;
  this.type;
  this.wrapper;
  this.trigger_event;
  this.target_event;
  this.current_state;
  this.disabled_class;
  this.elements = [];

  if (!trigger_types[settings.type]) {
    _error("Trying to create unknown trigger type");
  }

  if (settings.type == "DATALAYER_EVENT") {
    this.trigger_event = settings.value;
  }

  if (settings.type == "VISIBILITY") {
    this.addElements(settings.value);
  }

  this.type = settings.type;
  this.target_event = settings.event;
  this.current_state = "STALE";
  this.id = Registry.addItem(this);

  if (settings.status !== "STALE") {
    this.activate();
  }
}

Trigger.prototype.addEvent = function (event) {
  this.target_event = event;
};

Trigger.prototype.setTriggerEvent = function (event_name) {
  if (!_isStr(event_name)) {
    _error("Invalid triggering event name ");
  }

  this.trigger_event = event_name;
  return this;
};

Trigger.prototype.addElements = function (one_or_more_elements) {
  var elements_array = [].concat(one_or_more_elements);
  elements_array.forEach(function (elem) {
    if (!_isHtmlElement(elem)) _error("Trigger element should be an Element");
  });
  this.elements.push.apply(this.elements, elements_array);
};

Trigger.prototype.addDisabledClass = function (className) {
  this.disabled_class = className;
};

Trigger.prototype.setState = function (state) {
  if (!trigger_states[state]) {
    _error("Invalid trigger state");
  }

  if (!_contains_contains(["FIRED", "INACTIVE"], this.getState())) {
    this.current_state = state;
  }

  return this.current_state;
};

Trigger.prototype.getState = function () {
  if (this.type == "CLICK" && this.current_state !== "FIRED") {
    if (_hasClass(this.wrapper, this.disabled_class)) {
      this.current_state = "INACTIVE";
    } else this.current_state = "ACTIVATED";
  }

  return this.current_state;
};

Trigger.prototype.fire = function () {
  if (this.getState() == "ACTIVATED") {
    this.setState("FIRED");
    this.target_event.dispatch();
  }
};

Trigger.prototype.activate = function () {
  this.current_state = "ACTIVATED";

  if (this.type == "PAGE_VIEW") {
    return this.fire();
  }

  if (this.type == "CLICK") {
    TaggingController.setupTrigger(this);
  }

  if (this.type == "VISIBILITY") {
    TaggingController.setupTrigger(this);
  }

  if (this.type == "DATALAYER_EVENT") {
    ObserverModule_ObserverModule.addPushCallback(getCallback(this), this.trigger_event);
  }

  return this;
};

function getCallback(trigger) {
  return function () {
    trigger.fire();
  };
}
;// CONCATENATED MODULE: ./framework/6_events/classes/Event.js





function Event(name) {
  this.id;
  this.name;
  this.trigger;
  this.event_type;
  this.tracking_pixels = {};
  this.tracking_options = {};
  this.standardization_handlers = {};
  this.name = name;
  this.id = Registry.addItem(this);
  AttributeHandler.call(this);
}
Event.prototype = (Object.create || objectCreate)(AttributeHandler.prototype);
Event.prototype.constructor = Event;

Event.prototype.get = function (path) {
  return _getValue_getValue(path, this);
};

Event.prototype.setEventType = function (type_str) {
  this.event_type = type_str;
};

Event.prototype.getEventType = function () {
  return this.event_type;
};

Event.prototype.getHitTemplateConversions = function () {
  return this.tracking_options.template_conversions;
};

Event.prototype.addTrigger = function (trigger_config) {
  var settings = trigger_config || {};
  settings.event = this;
  return (this.trigger = new Trigger(settings)) && this.trigger;
};

Event.prototype.addStandardizationHandler = function (type, handler) {
  if (type in this.standardization_handlers) {
    _error("Standardization hanlder type has already been added");
  }

  this.standardization_handlers[type] = handler;
};

Event.prototype.addTrackingPixels = function (pixels_obj) {
  Object.assign(this.tracking_pixels, pixels_obj);
};

Event.prototype.addConversionPixels = function (pixels_obj) {
  Object.assign(this.conversion_pixels, pixels_obj);
};

Event.prototype.addTrackingOption = function (key, value) {
  if (!_contains_contains(["whitelist", "blacklist", "template_conversions", "send_gua_separately"], key)) _error("Tracking option not supported");
  this.tracking_options[key] = value;
};

Event.prototype.dispatch = function () {
  EventReleaseHandler.execute(this);
};
;// CONCATENATED MODULE: ./framework/6_events/MainEventHandler.js


var events_by_name = {};
var events_by_id = {};
var MainEventHandler = {
  createEvent: function createEvent(event_name, tracking_options_obj) {
    var event = new Event(event_name);

    if (tracking_options_obj) {
      addTrackingOptions(event, tracking_options_obj);
    }

    return this.registerEvent(event);
  },
  registerEvent: function registerEvent(event) {
    events_by_name[event.name] = (events_by_name[event.name] || []).concat(event);
    events_by_id[event.id] = event;
    return event;
  },
  getEventByName: function getEventByName(event_name) {
    if (!events_by_name[event_name] || events_by_name[event_name].length !== 1) {
      _error("Dispatching event by the specified name is not possibe");
    }

    return events_by_name[event_name][0];
  }
};

function addTrackingOptions(event, tracking_options_obj) {
  for (var key in tracking_options_obj) {
    event.addTrackingOption(key, tracking_options_obj[key]);
  }
}
;// CONCATENATED MODULE: ./framework/6_events/gtag-config/getUpdatedGoogleReferrer.js

function getUpdatedGoogleReferrer() {
  var parsed = _parseHref(document.location.href, true);

  if (parsed.ref_original) return parsed.ref_original;
  if (!document.referrer) return undefined;
  var referrer_host = document.referrer.split("/")[2];
  var host = document.location.hostname;
  return referrer_host == host ? undefined : document.referrer;
}
;// CONCATENATED MODULE: ./framework/6_events/gtag-config/getUpdatedLocation.js


var getUpdatedLocation_config;
function getUpdatedLocation() {
  getUpdatedLocation_config = getUpdatedLocation_config || _get("config");
  var url_queries_to_exclude = getUpdatedLocation_config.defaults.url_queries_to_exclude;
  var redact_emails = getUpdatedLocation_config.defaults.redact_emails_in_url;
  var location = document.location.href;

  var parsed = _parseHref(location, true);

  var filtered_base = location.split("?")[0] + parsed.hash;
  var filtered_queries = Object.keys(parsed.queries).reduce(function (clean, key) {
    if (parsed.queries[key].indexOf("@") > -1 && redact_emails) {
      clean[key] = "emailContentRemovedInGTM";
    } else if (!_contains_contains(url_queries_to_exclude, key)) {
      clean[key] = parsed.queries[key];
    }

    return clean;
  }, {});
  return _addQueries(filtered_base, filtered_queries);
}
;// CONCATENATED MODULE: ./framework/6_events/gtag-config/GtagConfigHandler.js


function GtagConfigHandler_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function GtagConfigHandler_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? GtagConfigHandler_ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : GtagConfigHandler_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }






var GtagConfigHandler_config;
var targets = [];
var config_states = {};

function GtagConfigHandler_initialize() {
  GtagConfigHandler_config = _get("config");
  targets = ["gua", "ga4"].reduce(function (acc, curr) {
    return acc.concat(GtagConfigHandler_config.tracking_pixels[curr] || []);
  }, []);
  ObserverModule_ObserverModule.addLifeCycleListener("consent_update", configPixelsOnConsentUpdate, "gtagConifgUpdateListener", false);
}

function configPixelsOnNewPage() {
  if (!GtagConfigHandler_config) GtagConfigHandler_initialize();

  var consent = _get("consent");

  targets.forEach(function (pixel_data) {
    var pixel_id = pixel_data.pixel_attributes;
    updateConfig(pixel_id, getConsentConfigAttributes(consent), getPageConfigAttributes(pixel_data));
  });
}

function configPixelsOnConsentUpdate() {
  var consent = _get("consent");

  targets.forEach(function (pixel_data) {
    var pixel_id = pixel_data.pixel_attributes;
    updateConfig(pixel_id, getConsentConfigAttributes(consent), config_states[pixel_id]);
  });
}

function updateConfig(pixel_id, consent_attributes, page_attributes) {
  config_states[pixel_id] = GtagConfigHandler_objectSpread(GtagConfigHandler_objectSpread({}, consent_attributes), page_attributes);
  DataLayerController.submitPrimaryMessage("config", pixel_id, config_states[pixel_id]);
}

function getConsentConfigAttributes(consent) {
  var signal_bool = (consent || "").indexOf('marketing') > -1;
  return {
    allow_ad_personalization_signals: signal_bool,
    allow_google_signals: signal_bool
  };
}

function getPageConfigAttributes(pixel_data) {
  var settings = {
    send_page_view: false,
    page_location: getUpdatedLocation(),
    page_referrer: getUpdatedGoogleReferrer()
  };

  if (pixel_data.custom_map) {
    settings.custom_map = pixel_data.custom_map;
  }

  if (pixel_data.measurement_side === "server") {
    settings.transport_url = GtagConfigHandler_config.server_side_endpoint;
    settings.first_party_collection = true;
  }

  return settings;
}
;// CONCATENATED MODULE: ./framework/6_events/_module/EventsModule.js







/**
 * @module Events
 * @typedef Event
 * @variation Common
 * @namespace events/common
 * @definition 
 */

var EventsModule = {
  classes: {
    AttributeHandler: AttributeHandler,
    Event: Event
  },
  addClass: function addClass(class_def) {
    EventsModule.classes[class_def.constructor.name] = class_def;
  },
  initialize: function initialize() {
    configPixelsOnNewPage();
    CommonAttributeManager.initialize();
  },
  getEventByName: function getEventByName(event_name) {
    return MainEventHandler.getEventByName(event_name);
  },
  create: function create(event_name, tracking_options_obj) {
    if (!_isStr(event_name)) {
      _error("Event name should be a string when grabbing it from controller");
    }

    if (tracking_options_obj && !_isObj(tracking_options_obj)) {
      _error("tracking opotions should be an object");
    }

    return MainEventHandler.createEvent(event_name, tracking_options_obj);
  },
  dispatch: function dispatch(event) {
    if (!(event instanceof Event)) {
      _error("Object passed for event dispatch is not an event instance");
    }

    EventReleaseHandler.execute(event);
  },
  register: function register(event) {
    if (!(event instanceof Event)) {
      _error("Object passed for event registration is not an event instance");
    }

    return MainEventHandler.registerEvent(event);
  }
};
;// CONCATENATED MODULE: ./framework/8_5_externalEvents/ExternalEventModule.js



var ExternalEventModule_config;
var ExternalEventModule = {
  submitExternalEvent: function submitExternalEvent(event_data, options) {
    _run(_submitExternalEvent, event_data, options || {});
  },
  submitHitTemplateEvent: function submitHitTemplateEvent(event_name, all_params, tracking_options) {
    _run(hitTemplateEvent, event_name, all_params, tracking_options);
  }
};

function hitTemplateEvent(event_name, all_params, tracking_options) {
  tracking_options = tracking_options || {};
  ExternalEventModule_config = ExternalEventModule_config || _get("config");
  var conversions_current_event = ExternalEventModule_config.utils.getHitTemplateConversions(tracking_options, event_name, all_params);
  if (conversions_current_event.length) tracking_options.template_conversions = conversions_current_event;
  if (event_name == "conversions" && !tracking_options.template_conversions) return;

  _submitExternalEvent(all_params, tracking_options, event_name);
}

function _submitExternalEvent(event_data, options, event_name) {
  if (!event_data || !_isObj(event_data)) return;
  var event_name = event_name || String(event_data.event_category);
  var event = EventsModule.create(event_name);

  if (event_name == "conversions") {
    event.setEventType("hit_conversions");
    event.addTrackingOption("whitelist", []);
  }

  for (var attr in event_data) {
    event.addAttribute(attr, "CONSTANT", event_data[attr]);
  }

  if (options.blacklist) {
    event.addTrackingOption("blacklist", options.blacklist);
  }

  if (options.whitelist) {
    event.addTrackingOption("whitelist", options.whitelist);
  }

  if (options.template_conversions) {
    event.addTrackingOption("template_conversions", options.template_conversions);
  }

  event.addTrigger({
    "type": "CALLBACK"
  }).fire();
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/standardization/_StandardizationHandler.js

var available_standardizers = {};
var StandardizationHandler = {
  addEcomStandardizer: function addEcomStandardizer(platform, instance) {
    if (available_standardizers[platform]) {
      _error("Ecom standardizer for platform already exists");
    }

    available_standardizers[platform] = instance;
  },
  countItems: function countItems(items_array) {
    return items_array.reduce(function (all, curr) {
      return all + (curr.quantity ? parseInt(curr.quantity) : 1);
    }, 0);
  },
  mapObject: function mapObject(object_in, lookup_table) {
    var lookup = lookup_table || {};
    var obj_to_map = object_in || {};
    return Object.keys(obj_to_map).reduce(function (out, attr) {
      var new_key = lookup[attr] || attr;

      if (obj_to_map[attr]) {
        out[new_key] = obj_to_map[attr];
      }

      return out;
    }, {});
  },
  mapItems: function mapItems(items_array, lookup_table) {
    var getMappedObject = this.mapObject;
    return (items_array || []).map(function (item_in) {
      return getMappedObject(item_in, lookup_table);
    });
  },
  getItemIds: function getItemIds(ga4_items_array, id_callback) {
    return (ga4_items_array || []).reduce(function (all, curr) {
      var raw_id = curr && curr.item_id;
      var formatted_id = raw_id && (id_callback ? id_callback(raw_id) : raw_id);
      return formatted_id ? all.concat(formatted_id) : all;
    }, []);
  },
  getAvailableStandardizers: function getAvailableStandardizers() {
    return available_standardizers;
  }
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/dispatch/EventGroupingHandler.js


var grouped_items = _store("_data.eecm_groups", {});

var EventGroupingHandler = {
  execute: function execute(event_obj) {
    var event_name = event_obj.name;

    if (!grouped_items[event_name]) {
      grouped_items[event_name] = {
        "event_obj": event_obj
      };
    } else {
      clearTimeout(grouped_items[event_name].timeout_handler);
      grouped_items[event_name].event_obj.items.push(event_obj.items[0]);
    }

    if (grouped_items[event_name].event_obj.items.length < 10) {
      grouped_items[event_name].timeout_handler = setTimeout(dispatchEvent, 1000, event_name);
    } else dispatchEvent(event_name);
  }
};

function dispatchEvent(event_name) {
  var ecom_event = grouped_items[event_name].event_obj;
  delete grouped_items[event_name];
  ecom_event.dispatch();
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/classes/Collection.js


function Collection(name, items_array, options_obj) {
  this.id;
  this.name;
  this.items = [];
  this.max_length;
  this.options_obj = options_obj;
  this.name = name;
  this.addMultiple(items_array);

  if (options_obj && options_obj.max_length) {
    this.max_length = options_obj.max_length;
  }

  this.id = Registry.addItem(this);
}

Collection.prototype.clear = function () {
  return this.items.splice(0, this.items.length) && this;
};

Collection.prototype.add = function (item) {
  this.items.push(item);
};

Collection.prototype.addToFront = function (item) {
  this.items.unshift(item);

  if (this.max_length && this.max_length < this.items.length) {
    this.items.length = this.max_length;
  }

  return item;
};

Collection.prototype.addMultiple = function (items_array) {
  if (!_isArray(items_array)) _error("addMultiple accepts array arguments only");

  for (var i in items_array) {
    this.add(items_array[i]);
  }
};

Collection.prototype.getItems = function () {
  return [].concat(this.items);
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/classes/ItemCollection.js


function ItemCollection(name, items_array, options_obj) {
  Collection.call(this, name, items_array, options_obj);
}
ItemCollection.prototype = (Object.create || objectCreate)(Collection.prototype);
ItemCollection.prototype.constructor = ItemCollection;

ItemCollection.prototype.find = function (attributes_object) {
  return this.items.find(function (collection_item) {
    return isSameItem(collection_item, attributes_object);
  });
};

ItemCollection.prototype.findIndex = function (attributes_object) {
  for (var index in this.items) {
    if (isSameItem(this.items[index], attributes_object)) return index;
  }
};

ItemCollection.prototype.remove = function (item_desc) {
  var item_index = this.findIndex(item_desc);
  if (_exists(item_index)) return this.items.splice(item_index, 1)[0];
};

function isSameItem(collection_item, item_to_find) {
  var comparison_attributes = ["item_name", "item_id", "item_variant"];
  var matching_attribute_count = 0;
  var description = item_to_find instanceof EcomItem ? item_to_find.getAttributes() : item_to_find;

  if (!collection_item || !description) {
    return false;
  }

  for (var i in comparison_attributes) {
    var attr = comparison_attributes[i];
    if (description[attr] && !_isStr(description[attr]) && !_isNum(description[attr])) _error("Invalid ecom item description");
    var collection_attr = collection_item[attr];
    var description_attr = description[attr];

    if (collection_attr && description_attr) {
      if (collection_attr !== description_attr) return false;else matching_attribute_count++;
    }
  }

  return !!matching_attribute_count;
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/classes/PersistedCollection.js


function PersistedCollection(collection, cookie_name) {
  this.had_previous_state = false;
  this.cookie_name = cookie_name;
  this.managed_collection = collection;
  this.id = Registry.addItem(this);
  var previous_data = getFromCookie(cookie_name);

  if (previous_data && previous_data.length) {
    this.had_previous_state = true;
    this.managed_collection.addMultiple(previous_data);
  }

  observeChanges(this.managed_collection);

  this.update = function () {
    updateRecord(collection);
  };

  function observeChanges(collection) {
    var methods = {
      "addToFront": "",
      "add": "",
      "removeByDesc": "",
      "clear": ""
    };

    for (var name in methods) {
      var original_fn = collection[name];
      collection[name] = getFunctionOverride(original_fn);
    }
  }

  function getFunctionOverride(original_fn) {
    return function (arg) {
      try {
        var ret = original_fn.call(collection, arg);
        updateRecord(collection);
        return ret;
      } catch (err) {
        _error("persisted_collection error");
      }
    };
  }

  function updateRecord(collection) {
    var to_save = collection.getItems();
    var cookie_days = config.basket_cookie_lifetime_days;

    if (to_save.length) {
      _setCookie(cookie_name, JSON.stringify(to_save), cookie_days);
    } else {
      _deleteCookie(cookie_name);
    }
  }

  function getFromCookie(cookie_name) {
    var cookie_value = _getCookie(cookie_name);

    return cookie_value && JSON.parse(cookie_value);
  }
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/dispatch/persistance/ItemAttributeHandler.js



var cookie_name = "_traqed_seen_items";
var persistance_handler;

function ItemAttributeManager() {
  ItemCollection.call(this, "seen_items", [], {
    "max_length": 15
  });
  persistance_handler = new PersistedCollection(this, cookie_name);
}

ItemAttributeManager.prototype = (Object.create || objectCreate)(ItemCollection.prototype);
ItemAttributeManager.prototype.constructor = ItemAttributeManager;

ItemAttributeManager.prototype.execute = function (ecom_event) {
  var ecom_item = getItem(ecom_event);

  if (ecom_event.name === "select_item") {
    addSelectedItem(ecom_item, this);
  } else if (ecom_event.name === "view_item") {
    addViewedItem(ecom_item, this);
  }

  ecom_event.getDispatchController().executeNext();
};

function getItem(ecom_event) {
  var ecom_item = ecom_event.items[0];

  if (ecom_item.constructor.name !== "EcomItem") {
    _error("Attribute tracker only accepts EcomItems as selected item");
  }

  return ecom_item;
}

function addSelectedItem(ecom_item, collection) {
  collection.addToFront(ecom_item.getAttributes());
}

function addViewedItem(ecom_item, collection) {
  var item_attributes = ecom_item.getAttributes();
  var previous_state = collection.remove(item_attributes);

  if (!previous_state) {
    return collection.addToFront(item_attributes);
  }

  ecom_item.merge(previous_state);
  collection.addToFront(ecom_item.getAttributes());
  return ecom_item;
}

var ItemAttributeHandler = new ItemAttributeManager();
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/dispatch/persistance/BasketHandler.js





var BasketHandler_cookie_name = "_traqed_basket";
var BasketHandler_persistance_handler;

function BasketItemsHandler() {
  ItemCollection.call(this, "basket_items", []);
  BasketHandler_persistance_handler = new PersistedCollection(this, BasketHandler_cookie_name);
  var basket_items = [].concat(this.items);
  LifeCycleHandler.pushEvent({
    "event": "ecom_module.basket_ready",
    "items": basket_items,
    "remove": this.remove.bind(this)
  });
}

BasketItemsHandler.prototype = (Object.create || objectCreate)(ItemCollection.prototype);
BasketItemsHandler.prototype.constructor = BasketItemsHandler;

BasketItemsHandler.prototype.execute = function (ecom_event) {
  var target_item = getTargetItem(ecom_event);
  var operation_quantity = ecom_event.getAttribute("item_quantity");

  if (!_isNum(operation_quantity)) {
    _error("Insufficient operation quantity in basket operation");
  }

  var action_fn = ecom_event.name === "add_to_cart" ? addToCart : removeFromCart;
  action_fn.call(this, target_item, operation_quantity);
  target_item.addOrUpdateAttribute("quantity", "CONSTANT", operation_quantity);
  ecom_event.getDispatchController().executeNext();
};

BasketItemsHandler.prototype.syncItems = function (scraped_items) {
  var valid_items = scraped_items.reduce(function (all, ecom_item) {
    var prev_state = this.remove(ecom_item.getAttributes());
    if (prev_state) ecom_item.merge(prev_state);
    return ecom_item.isValid() ? all.concat(ecom_item) : all;
  }, []);
  this.clear();
  valid_items.forEach(function (ecom_item) {
    this.add(ecom_item.getAttributes());
  }.bind(this));
  return valid_items;
};

function getTargetItem(ecom_event) {
  var items_array = ecom_event.getItems();
  return items_array[0] || _error("Invalid event submitted for basket operation");
}

function addAndUpdate(ecom_item, quantity_to_add) {
  var current_quantity = ecom_item.getAttribute("quantity") || 0;
  var in_basket_quantity = current_quantity + quantity_to_add;

  if (in_basket_quantity > 0) {
    var updated_attributes = Object.assign(ecom_item.getAttributes(), {
      "quantity": in_basket_quantity
    });
    this.add(updated_attributes);
  }
}

function addToCart(ecom_item, operation_quantity) {
  var item_attributes = ecom_item.getAttributes();
  var prev_state = this.remove(item_attributes) || ItemAttributeHandler.remove(item_attributes);
  if (prev_state) ecom_item.merge(prev_state);

  if (ecom_item.isValid()) {
    addAndUpdate.call(this, ecom_item, operation_quantity);
  }
}

function removeFromCart(ecom_item, operation_quantity) {
  var prev_state = this.remove(ecom_item.getAttributes());
  if (prev_state) ecom_item.merge(prev_state);
  addAndUpdate.call(this, ecom_item, operation_quantity * -1);
}

var BasketHandler = new BasketItemsHandler();
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/dispatch/PurchaseHandler.js



var PurchaseHandler = {
  execute: function execute(ecom_event) {
    if (!ecom_event.getAttribute("transaction_id")) {
      _log("Transaction id missing");
    }

    BasketHandler.clear();
    ItemAttributeHandler.clear();
    ecom_event.getDispatchController().executeNext();
  }
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/dispatch/EcomDispatchManager.js





var EcomDispatchManager = {
  addProcessSteps: function addProcessSteps(ecom_event) {
    ecom_event.addStandardizationHandler("ecom", StandardizationHandler);

    if (_contains(["view_item_list", "view_promotion"], ecom_event.name)) {
      return EventGroupingHandler.execute(ecom_event);
    }

    if (_contains(["select_item", "view_item"], ecom_event.name)) {
      ItemAttributeHandler.execute(ecom_event);
    }

    if (_contains(["add_to_cart", "remove_from_cart"], ecom_event.name)) {
      BasketHandler.execute(ecom_event);
    }

    if (ecom_event.name == "purchase") {
      PurchaseHandler.execute(ecom_event);
    }

    ecom_event.dispatch();
  }
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/classes/EcomEvent.js


var EcomEvent_Event = EventsModule.classes.Event;
function EcomEvent(event_name) {
  this.css_attribute_selector_context;
  this.disabled_item_class;
  this.items = [];
  this.wrapper;
  EcomEvent_Event.call(this, event_name);
  this.addTrackingOption("send_gua_separately", true);
  this.setEventType("ecom");
}
EcomEvent.prototype = (Object.create || objectCreate)(EcomEvent_Event.prototype);
EcomEvent.prototype.constructor = EcomEvent;

EcomEvent.prototype.setAttributeSelectorContext = function (wrapper_element) {
  if (!(wrapper_element instanceof Element)) {
    _error("Ecom Event wrapper should be an Element");
  }

  return (this.wrapper = this.css_attribute_selector_context = wrapper_element) && this;
};

EcomEvent.prototype.getItems = function () {
  return this.items;
};

EcomEvent.prototype.addItems = function (items_array) {
  if (!_isArray(items_array)) _error("Items array passed to EcomEvent should be of type array");

  for (var i in items_array) {
    this.addItem(items_array[i]);
  }
};

EcomEvent.prototype.addItem = function (ecom_item) {
  if (ecom_item.constructor.name !== "EcomItem") _error("Ecom Event's items array can only be filled with EcomItem instances");
  this.items.push(ecom_item);
};

EcomEvent.prototype.getAttributes = function () {
  var attributes = EcomEvent_Event.prototype.getAttributes.call(this);

  if (!attributes.items) {
    attributes.items = this.items.reduce(function (all, curr) {
      return curr.isValid() ? all.concat(curr.getAttributes()) : all;
    }, []);
  }

  return attributes;
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/EcomEventHandler.js





var EcomEventHandler_config;
var EcomEventHandler = {
  create: function create(event_name, one_or_more_items, event_area_wrapper) {
    EcomEventHandler_config = EcomEventHandler_config || _get("config");
    var event = new EcomEvent(event_name);
    EcomDispatchManager.addProcessSteps(event);
    EventsModule.register(event);

    if (event_area_wrapper) {
      event.setAttributeSelectorContext(event_area_wrapper);
    }

    if (EcomEventHandler_config.currency) event.addAttribute("currency", "CONSTANT", EcomEventHandler_config.currency);
    event.addAttribute("event_category", "CONSTANT", "Ecommerce");
    event.addAttribute("event_action", "CONSTANT", event.name);
    event.addAttribute("event_label", "CONSTANT", "none");
    event.addAttribute("non_interaction", "CONSTANT", getNonInteractionBool(event_name));
    one_or_more_items && [].concat(one_or_more_items).forEach(function (ecom_item) {
      event.addItem(ecom_item);
      ecom_item.addEvent(event);
    });
    return event;
  }
};

function getNonInteractionBool(event_name) {
  return _contains_contains(["view_promotion", "view_item_list", "view_item", "view_cart"], event_name);
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/helpers/CartActionHelper.js


var CartActionHelper = {
  initiate: function initiate(cart_action, ecom_item, quantity) {
    var quantity_parsed = parseInt(quantity);
    if (!_isNum(quantity_parsed)) return;
    var event = EcomEventHandler.create(cart_action, ecom_item, ecom_item.wrapper);
    event.addAttribute("item_quantity", "CONSTANT", quantity_parsed);
    event.addTrigger({
      "type": "CALLBACK"
    }).fire();
  }
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/classes/EcomItem.js




var EcomItem_AttributeHandler = EventsModule.classes.AttributeHandler;
function EcomItem_EcomItem(type, config, wrapper) {
  this.id;
  this.type;
  this.config;
  this.wrapper;
  this.is_valid;
  this.events = [];
  this.attributes = {};
  if (!_contains_contains(["product", "promotion"], type)) _error("Invalid Ecom Item type");
  if (config && !_isObj(config)) _error("Ecom Item config must be an object");
  if (wrapper && !(wrapper instanceof Element)) _error("Ecom Item wrapper must be of type Element");
  this.type = type;
  this.config = config;
  this.wrapper = wrapper;
  this.id = Registry.addItem(this);
}
EcomItem_EcomItem.prototype = (Object.create || objectCreate)(EcomItem_AttributeHandler.prototype);
EcomItem_EcomItem.prototype.constructor = EcomItem_EcomItem;

EcomItem_EcomItem.prototype.isValid = function () {
  return !!(this.getAttribute("item_name") || this.getAttribute("item_id"));
};

EcomItem_EcomItem.prototype.addEvent = function (event) {
  this.events.push(event);
};

EcomItem_EcomItem.prototype.addToCart = function (quantity) {
  CartActionHelper.initiate("add_to_cart", this, quantity);
};

EcomItem_EcomItem.prototype.removeFromCart = function (quantity) {
  CartActionHelper.initiate("remove_from_cart", this, quantity);
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/EcomItemHandler.js


var EcomItemHandler = {
  create: function create(type, config, wrapper, index) {
    var item = new EcomItem_EcomItem(type, config, wrapper);

    if (_isNum(index)) {
      item.addAttribute("index", "CONSTANT", index);
    }

    return item;
  }
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/listeners/StdTransactionConverter.js




var item_attribute_map = {
  "sku": "item_id",
  "name": "item_name",
  "category": "item_category",
  "price": "price",
  "quantity": "quantity"
};
var purchase_attribute_map = {
  'transactionId': 'transaction_id',
  'transactionAffiliation': 'affiliation',
  'transactionTotal': 'value',
  'transactionTax': 'tax',
  'transactionShipping': 'shipping',
  'voucherCode': 'coupon',
  'currencyCode': 'currency',
  'transactionProducts': 'items'
};
var StdTransactionConverter = {
  initialize: function initialize() {
    ObserverModule_ObserverModule.addPushListener(convertStdEcommerce);
  }
};

function convertStdEcommerce(message) {
  var content = message.getContent();

  if (content && content.transactionId) {
    message.cancel();
    mapToGtag(content);
  }
}

function mapToGtag(msg) {
  var event_obj = EcomEventHandler.create("purchase");
  var attributes = StandardizationHandler.mapObject(msg, purchase_attribute_map);
  attributes.currency = attributes.currency || config.currency;
  var items;

  if (attributes.items) {
    items = attributes.items;
    delete attributes.items;
  }

  ecom_event.merge(attributes);
  var item_attributes_array = StandardizationHandler.mapItems(items || [], item_attribute_map);
  item_attributes_array.forEach(function (attrs) {
    var item = EcomItemHandler.create("product", {}).merge(attrs);
    ecom_event.addItem(item);
  });
  event_obj.addTrigger({
    "type": "CALLBACK"
  }).fire();
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/listeners/StdEECConverter.js




var StdEECConverter_item_attribute_map = {
  "id": "item_id",
  "name": "item_name",
  "position": "index",
  "brand": "item_brand",
  "category": "item_category",
  "coupon": "coupon",
  "list": "item_list_name",
  "price": "price",
  "quantity": "quantity",
  "variant": "item_variant"
};
var promotion_attribute_map = {
  "id": "item_id",
  "name": "promotion_name",
  "creative": "creative_name",
  "position": "creative_slot"
};
var StdEECConverter_purchase_attribute_map = {
  'id': 'transaction_id',
  'affiliation': 'affiliation',
  'revenue': 'value',
  'tax': 'tax',
  'shipping': 'shipping',
  'coupon': 'coupon'
};
var StdEECConverter = {
  initialize: function initialize() {
    ObserverModule_ObserverModule.addPushListener(convertEnhancedEcommerce);
  }
};

function getItemsLocation(std_event_name) {
  if (std_event_name === "view_item_list") return "impressions";
  if (std_event_name.indexOf("promotion") > -1) return "promotions";
  return products;
}

function convertEnhancedEcommerce(msg) {
  if (!msg || !msg.content || !msg.content.ecommerce) {
    return;
  }

  msg.cancel();
  var ecom_object = msg.content.ecommerce;
  var std_event_name = getStandardEventName(ecom_object);
  var items_location = getItemsLocation(std_event_name);
  var items_array_old = getItems(items_location, ecom_object) || [];
  var is_promo = std_event_name.indexOf("promotion") > -1;
  var attribute_map = is_promo ? promotion_attribute_map : StdEECConverter_item_attribute_map;
  var item_attributes_array = StandardizationHandler.mapItems(items_array_old, attribute_map);
  var ecom_event = EcomEventHandler.create(std_event_name);
  item_attributes_array.forEach(function (attrs) {
    var item = EcomItemHandler.create(!is_promo ? "product" : "promotion", {}).merge(attrs);
    ecom_event.addItem(item);
  });

  if (std_event_name === "purchase") {
    var purchase_attributes = ecom_object.purchase && ecom_object.purchase.actionField || {};
    var refactored_attributes = StandardizationHandler.mapObject(purchase_attributes, StdEECConverter_purchase_attribute_map);
    ecom_event.merge(refactored_attributes);
  }

  ecom_event.addTrigger({
    "type": "CALLBACK"
  }).fire();
}

function getItems(items_location, ecomObject) {
  if (items_location == "promotions") {
    return ecomObject.promoView && ecomObject.promoView.promotions || ecomObject.promoClick && ecomObject.promoClick.promotions;
  }

  if (items_location == "impressions") return ecomObject.impressions;
  if (ecomObject.click) return ecomObject.click.products;
  if (ecomObject.detail) return ecomObject.detail.products;
  if (ecomObject.add) return ecomObject.add.products;
  if (ecomObject.remove) return ecomObject.remove.products;
  if (ecomObject.checkout) return ecomObject.checkout.products;
  if (ecomObject.purchase) return ecomObject.purchase.products;
}

function getCheckoutOption(msg) {
  return _getValue("ecommerce.checkout_option.actionField.option", msg.content) || _getValue("ecommerce.checkout.actionField.option", msg.content);
}

function getStandardEventName(ecomObject) {
  if (ecomObject.promoView && ecomObject.promoView.promotions && ecomObject.promoView.promotions.length) return "view_promotion";
  if (ecomObject.promoClick && ecomObject.promoClick.promotions && ecomObject.promoClick.promotions.length) return "select_promotion";
  if (ecomObject.impressions && ecomObject.impressions.length) return "view_item_list";
  if (ecomObject.click) return "select_item";
  if (ecomObject.detail) return "view_item";
  if (ecomObject.add) return "add_to_cart";
  if (ecomObject.remove) return "remove_from_cart";
  if (ecomObject.checkout) return "begin_checkout";
  if (ecomObject.purchase) return "purchase";
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/classes/ConfigGroup.js


function ConfigGroup(config_obj, wrapper, name) {
  this.id;
  this.items = [];
  this.name = name;
  this.wrapper = wrapper;
  this.config = config_obj;
  this.basket_items_plain;
  this.id = Registry.addItem(this);
}

ConfigGroup.prototype.addItem = function (item) {
  if (!item || !item.constructor || item.constructor.name !== "EcomItem") _error("Ecom Group addItem accepts Ecom Items only.");
  this.items.push(item);
};

ConfigGroup.prototype.setItems = function (items_array) {
  this.items.length = 0;

  for (var i in items_array) {
    this.addItem(items_array[i]);
  }
};

ConfigGroup.prototype.setBasketContents = function (items_array) {
  if (!_isArray(items_array)) _error("Basket contents should be in array format");
  this.basket_items_plain = items_array;
};

ConfigGroup.prototype.isAssetGroup = function () {
  return _contains_contains(["list", "promotion"], this.name);
};

ConfigGroup.prototype.isEventGroup = function () {
  return _contains_contains(["view_item", "view_cart", "begin_checkout", "add_payment_info", "add_shipping_info", "purchase"], this.name);
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/helpers/EventHelper.js

var EventHelper = {
  getEventName: function getEventName(ecom_action, group_name) {
    switch (ecom_action) {
      case "view":
        return getViewEvent(group_name);

      case "select":
        return getSelectionEvent(group_name);

      case "add_to_cart_single":
      case "add_to_cart_multiple":
      case "add_to_cart_special_external":
        return "add_to_cart";

      case "remove_from_cart_single":
      case "remove_from_cart_multiple":
      case "remove_from_cart_special_external":
        return "remove_from_cart";

      case "wishlist":
        return "add_to_wishlist";

      default:
        _error("unrecognized event action: '" + ecom_action + "'");

    }
  }
};

function getSelectionEvent(group_name) {
  switch (group_name) {
    case "promotion":
      return "select_promotion";

    case "product":
      return "select_item";

    case "list":
      return "select_item";

    default:
      _error("Group: '" + group_name + "' does not support select event");

  }
}

function getViewEvent(group_name) {
  switch (group_name) {
    case "promotion":
      return "view_promotion";

    case "list":
      return "view_item_list";

    default:
      return group_name;
  }
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/helpers/AttributeHelper.js

var AttributeHelper = {
  execute: function execute(asset, attribute_config) {
    if (!_isObj(attribute_config)) return;

    for (var attr in attribute_config) {
      var current = attribute_config[attr];

      if (current) {
        asset.addAttribute(attr, current.type, current.value);
      }
    }
  }
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/tagging/ViewEventHandler.js



var ViewEventHandler = {
  execute: function execute(config_group, one_or_more_items, event_area_wrapper) {
    var event_name = EventHelper.getEventName("view", config_group.name);
    var event = EcomEventHandler.create(event_name, one_or_more_items, event_area_wrapper);
    var event_attributes = config_group.config && config_group.config.event_attributes;
    AttributeHelper.execute(event, event_attributes);
    return event;
  }
};
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/tagging/ItemEventHandler.js





var safeTagItemAction = _getRunner({
  "func": tagItemAction,
  "error_msg": "Error while trying to create ecom item events"
});

var action_events = ["select", "add_to_cart_single", "add_to_cart_multiple", "remove_from_cart_single", "remove_from_cart_multiple", "wishlist"];
var ItemEventHandler = {
  execute: function execute(ecom_group) {
    for (var i in ecom_group.items) {
      for (var j in action_events) {
        ecom_group.config[action_events[j]] && safeTagItemAction.execute(ecom_group.items[i], action_events[j]);
      }
    }
  }
};

function tagItemAction(item, action) {
  var event_name = EventHelper.getEventName(action, item.type);
  var event = EcomEventHandler.create(event_name, item, item.wrapper);

  if (["add_to_cart_single", "remove_from_cart_single"].indexOf(action) > -1) {
    event.addAttribute("item_quantity", "CONSTANT", 1);
  }

  if (["add_to_cart_multiple", "remove_from_cart_multiple"].indexOf(action) > -1) {
    event.addAttribute("item_quantity", "CSS_SELECTOR", item.config.quantity);
  }

  var trigger = event.addTrigger({
    "type": "CLICK",
    "status": "STALE"
  });
  trigger.addElements(getTriggerElements(item, action));

  if (item.config.disabled_class) {
    trigger.addDisabledClass(item.config.disabled_class);
  }

  trigger.activate();
}

function getTriggerElements(item, action_event) {
  var trigger_selector = item.config[action_event];
  var full_selector = trigger_selector == "*" ? "*" : trigger_selector + ", " + trigger_selector + " *";
  return _getNodesArray(full_selector, item.wrapper);
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/tagging/ItemHandler.js





var safeProcessSingleItem = _getRunner({
  "func": processSingleItem,
  "error_msg": "Error while trying to get items in a group"
});

var ItemHandler = {
  execute: function execute(ecom_group) {
    getItemWrappers(ecom_group).forEach(function (wrapper) {
      safeProcessSingleItem.execute(wrapper, ecom_group);
    });
  }
};

function getItemWrappers(ecom_group) {
  return ecom_group.config.item ? _getNodesArray(ecom_group.config.item, ecom_group.wrapper) : [ecom_group.wrapper];
}

function processSingleItem(wrapper, ecom_group) {
  var item_attr_config = ecom_group.config && ecom_group.config.item_attributes;
  var type = ecom_group.name.indexOf("promotion") > -1 ? "promotion" : "product";
  var item = EcomItemHandler.create(type, ecom_group.config, wrapper);
  AttributeHelper.execute(item, item_attr_config);

  if (!item.getAttribute("currency")) {
    item.addAttribute("currency", "CONSTANT", config.currency);
  }

  ecom_group.addItem(item);
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/tagging/GroupHandler.js






var GroupHandler = {
  execute: function execute(config_group, has_item_config) {
    if (has_item_config) {
      handleGroupWithItemConfig(config_group);
    } else handleGroupWithoutItemConfig(config_group);
  }
};

function handleGroupWithoutItemConfig(config_group) {
  if (config_group.isAssetGroup() || config_group.name === "view_item") {
    _error("Ecom group '" + config_group.name + "' should have item config");
  }

  var view_event = ViewEventHandler.execute(config_group, null, config_group.wrapper);
  BasketHandler.getItems().forEach(function (item_state) {
    var ecom_item = EcomItemHandler.create("product").merge(item_state);
    view_event.addItem(ecom_item);
  });
  view_event.addTrigger(config_group.config.trigger);
}

function handleGroupWithItemConfig(config_group) {
  ItemHandler.execute(config_group);

  if (_contains_contains(["list", "promotion"], config_group.name)) {
    config_group.items.forEach(function (item, index) {
      item.addAttribute("index", "CONSTANT", index);
      var view_event = ViewEventHandler.execute(config_group, item, item.wrapper);
      view_event.addTrigger({
        "type": "VISIBILITY",
        "value": item.wrapper
      });
    });
  } else if (config_group.name == "view_item") {
    if (!config_group.items.length) return;
    var view_event = ViewEventHandler.execute(config_group, config_group.items, config_group.items[0].wrapper);
    view_event.addTrigger(config_group.config.trigger);
  } else if (_contains_contains(["view_cart", "begin_checkout", "add_payment_info", "add_shipping_info", "purchase"], config_group.name)) {
    var updated_items = BasketHandler.syncItems(config_group.items);
    var view_event = ViewEventHandler.execute(config_group, updated_items, config_group.wrapper);
    view_event.addTrigger(config_group.config.trigger);
  } else {
    _error("Group name '" + config_group.naame + "' not recognized in tagging handler");
  }

  if (config_group.items.length) {
    ItemEventHandler.execute(config_group);
  }
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/tagging/EECMTaggingHandler.js



var EECMTaggingHandler = {
  execute: function execute() {
    var safeHandleGroup = _getRunner({
      "func": GroupHandler.execute,
      "context": GroupHandler,
      "error_msg": "Error while parsing ecom group"
    });

    for (var ecom_group_name in config.eec_module_config) {
      for (var i in config.eec_module_config[ecom_group_name]) {
        var group_config = config.eec_module_config[ecom_group_name][i];
        var config_group = getConfigGroup(group_config, ecom_group_name);
        if (!config_group) continue;
        safeHandleGroup.execute(config_group, hasItemConfig(config_group));
      }
    }
  }
};

function getConfigGroup(config_obj, group_name) {
  var group_wrapper = _getSingleNode(config_obj.container);

  if (group_wrapper) return new ConfigGroup(config_obj, group_wrapper, group_name);
}

function hasItemConfig(config_group) {
  return config_group.config.item_attributes && Object.keys(config_group.config.item_attributes).length > 0;
}
;// CONCATENATED MODULE: ./framework/8_3_ecomEvents/_module/EcomEventsModule.js








var EcomEventsModule_config;
var EcomEventsModule = {
  initialize: function initialize() {
    EcomEventsModule_config = EcomEventsModule_config || _get("config");

    if (EcomEventsModule_config.ecommerce_tracking === "disabled") {
      return;
    }

    if (EcomEventsModule_config.ecommerce_tracking === "push_mapping") {
      StdTransactionConverter.initialize();
      StdEECConverter.initialize();
      return;
    }

    if (EcomEventsModule_config.ecommerce_tracking === "through_module") {
      TaggingController.addTaggingRequest("ecom", EECMTaggingHandler);
    }
  },
  getBasketItem: function getBasketItem(item_desc) {
    if (!_isObj(item_desc)) _error("Invalid item description in ecom module");
    var item_found = BasketHandler.find(item_desc);

    if (item_found) {
      var item = EcomItemHandler.create("product");
      item_desc.quantity = item_found.quantity;
      item.merge(item_desc);
      return item;
    }
  }
};
;// CONCATENATED MODULE: ./framework/9_8_startup/BrowserInterface.js









var BrowserInterface = {
  initialize: function initialize() {
    window.gtm_assistant = {
      "run": _run,
      "get": function get(key) {
        return _run(_get, key);
      },
      "set": function set(key, value, merge) {
        return _run(_store, key, value, merge);
      },
      "error": _error,
      "getCookie": _getCookie,
      "flushErrors": function flushErrors(debug_params) {
        return _run(Logger.flushErrors.bind(Logger), debug_params);
      },
      "logTagError": function logTagError(tag_data, debug_params) {
        return _run(Logger.logTagError.bind(Logger), tag_data, debug_params);
      },
      "getValue": function getValue(key, object) {
        return _run(_getValue_getValue, key, object);
      },
      "parseHref": function parseHref(href, parse_query) {
        return _run(_parseHref, href, parse_query);
      },
      "getNumber": function getNumber(txt) {
        return _run(_getNumber, txt);
      },
      "getNodesArray": function getNodesArray(one_or_more_css_selectors, context_node_object) {
        return _run(_getNodesArray, one_or_more_css_selectors, context_node_object);
      },
      "getElementText": function getElementText(elem) {
        return _run(_getElementText, elem);
      },
      "getAttributeOwner": function getAttributeOwner(owner_id) {
        return Registry.get(owner_id);
      },
      "getEventByName": function getEventByName(event_name) {
        return EventsModule.getEventByName(event_name);
      },
      "getBasketItem": function getBasketItem(item_desc) {
        return EcomEventsModule.getBasketItem(item_desc);
      },
      "submitExternalEvent": function submitExternalEvent(event_data) {
        ExternalEventModule.submitExternalEvent(event_data);
      },
      "submitHitTemplateEvent": function submitHitTemplateEvent(event_name, all_params, tracking_options) {
        ExternalEventsModule.submitHitTemplateEvent(event_name, all_params, tracking_options);
      },
      "addPushListener": function addPushListener(listener_fn, name) {
        ObserverModule_ObserverModule.addPushListener(listener_fn, name);
      },
      "addAjaxListener": function addAjaxListener(listener_fn, name) {
        ObserverModule_ObserverModule.addAjaxListener(listener_fn, name);
      },
      "addLifeCycleCallback": function addLifeCycleCallback(life_cycle_event, callback, name, listen_to_past) {
        ObserverModule_ObserverModule.addLifeCycleListener(life_cycle_event, callback, name, listen_to_past);
      }
    };
  }
};
;// CONCATENATED MODULE: ./framework/9_8_startup/startUpStep1.js


function startUpStep1() {
  DataLayerController.initialize();
  BrowserInterface.initialize();
}
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/PagePerformance.js

/** 
 * @name page_performance
 * @type BasicEvent
 * @namespace events/basic-events
 * 
*/

var enabled_components = [];
var attributes_ready = {};
var first_event_sent;
var page_load_time_in;
var load_time_enabled;
var submit_timer;
var event_count = 0;
var PagePerformance = {
  addComponent: function addComponent(name) {
    enabled_components.push(name);

    if (name === "page_performance") {
      load_time_enabled = true;
    }
  },
  addAttributes: function addAttributes(attributes_in) {
    if (attributes_in.page_load_time) {
      page_load_time_in = true;
    }

    event_count++;
    Object.assign(attributes_ready, attributes_in);
    PagePerformance_checkConditions();
  }
};

function PagePerformance_checkConditions() {
  if (load_time_enabled && !first_event_sent && !page_load_time_in || submit_timer) return;

  if (event_count >= 4) {
    submitEvent();
  } // allow some extra time for gouping ( usually cwv )
  else submit_timer = setTimeout(submitEvent, 1500);
}

function getTrackingOptions() {
  if (!first_event_sent) return {
    "whitelist": ["gua", "ga4"]
  };
  return {
    "whitelist": ["ga4"]
  };
}

function submitEvent() {
  var event = EventsModule.create("page_performance", getTrackingOptions());
  event.addAttribute("transport_type", "CONSTANT", "beacon");
  event.addAttribute("non_interaction", "CONSTANT", true);

  if (!first_event_sent) {
    event.addAttribute("event_category", "CONSTANT", "Page Load Time");
    event.addAttribute("event_action", "CONSTANT", "none");
    event.addAttribute("event_label", "CONSTANT", "none");
    first_event_sent = true;
  }

  event.merge(attributes_ready);
  attributes_ready = {};
  submit_timer = null;
  event_count = 0;
  event.addTrigger({
    "type": "CALLBACK"
  }).fire();
}
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/_performance/PageLoadTime.js



var load_time;
var PageLoadTime = {
  event_name: "page_performance",
  initialize: function initialize() {
    BasicEventsModule.register(this);
  },
  init_event: function initPageLoad() {
    PagePerformance.addComponent("page_performance");
    listenToLoad();
  }
};

function listenToLoad() {
  ObserverModule_ObserverModule.addPushCallback(function () {
    if (!load_time) {
      load_time = getPageLoadTime();
      PagePerformance.addAttributes({
        "page_load_time": load_time,
        "value": load_time
      });
    }
  }, "gtm.load");
}

function getPageLoadTime() {
  var timing = window.performance && window.performance.timing;
  var ms = timing.loadEventStart - timing.navigationStart;
  var loadTime = (ms % 60000 / 1000).toFixed(2);
  var cached = loadTime >= 0 ? loadTime : undefined;
  return parseFloat(cached);
}

;
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/_performance/WebVitalsListener.js


var WebVitalsListener = {
  event_name: "web_vitals",
  initialize: function initialize() {
    BasicEventsModule.register(this);
  },
  init_event: function initWebVitals() {
    PagePerformance.addComponent("web_vitals");
    registerWebVitalListeners();
  }
};

function registerWebVitalListeners() {
  webVitals.getCLS(createEvent);
  webVitals.getFCP(createEvent);
  webVitals.getFID(createEvent);
  webVitals.getLCP(createEvent);
  webVitals.getTTFB(createEvent);
}

function createEvent(obj) {
  var attributes = {};
  var name = obj.name.toLowerCase();
  attributes["web_vitals_" + name + "_sample_id"] = obj.id;
  attributes["web_vitals_" + name + "_sample_value"] = obj.value;
  attributes["web_vitals_" + name + "_sample_delta"] = obj.delta;
  PagePerformance.addAttributes(attributes);
}

var webVitals = function (q) {
  var n,
      r,
      C,
      w,
      m = function m(b, a) {
    return {
      name: b,
      value: void 0 === a ? -1 : a,
      delta: 0,
      entries: [],
      id: "v2-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1E12)
    };
  },
      x = function x(b, a) {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(b) && ("first-input" !== b || "PerformanceEventTiming" in self)) {
        var g = new PerformanceObserver(function (c) {
          return c.getEntries().map(a);
        });
        return g.observe({
          type: b,
          buffered: !0
        }), g;
      }
    } catch (c) {}
  },
      y = function y(b, a) {
    var g = function f(d) {
      "pagehide" !== d.type && "hidden" !== document.visibilityState || (b(d), a && (document.removeEventListener("visibilitychange", f, !0), document.removeEventListener("pagehide", f, !0)));
    };

    document.addEventListener("visibilitychange", g, !0);
    document.addEventListener("pagehide", g, !0);
  },
      t = function t(b) {
    document.addEventListener("pageshow", function (a) {
      a.persisted && b(a);
    }, !0);
  },
      p = function p(b, a, g) {
    var c;
    return function (d) {
      0 <= a.value && (d || g) && (a.delta = a.value - (c || 0), (a.delta || void 0 === c) && (c = a.value, b(a)));
    };
  },
      u = -1,
      D = function D() {
    y(function (b) {
      u = b.timeStamp;
    }, !0);
  },
      z = function z() {
    return 0 > u && (u = "hidden" === document.visibilityState ? 0 : 1 / 0, D(), t(function () {
      setTimeout(function () {
        u = "hidden" === document.visibilityState ? 0 : 1 / 0;
        D();
      }, 0);
    })), {
      get firstHiddenTime() {
        return u;
      }

    };
  },
      E = function E(b, a) {
    var g,
        c = z(),
        d = m("FCP"),
        f = function f(h) {
      "first-contentful-paint" === h.name && (k && k.disconnect(), h.startTime < c.firstHiddenTime && (d.value = h.startTime, d.entries.push(h), g(!0)));
    },
        e = window.performance && performance.getEntriesByName && performance.getEntriesByName("first-contentful-paint")[0],
        k = e ? null : x("paint", f);

    (e || k) && (g = p(b, d, a), e && f(e), t(function (h) {
      d = m("FCP");
      g = p(b, d, a);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          d.value = performance.now() - h.timeStamp;
          g(!0);
        });
      });
    }));
  },
      F = !1,
      A = -1,
      v = {
    passive: !0,
    capture: !0
  },
      J = new Date(),
      I = function I(b, a) {
    n || (n = a, r = b, C = new Date(), G(document.removeEventListener), H());
  },
      H = function H() {
    if (0 <= r && r < C - J) {
      var b = {
        entryType: "first-input",
        name: n.type,
        target: n.target,
        cancelable: n.cancelable,
        startTime: n.timeStamp,
        processingStart: n.timeStamp + r
      };
      w.forEach(function (a) {
        a(b);
      });
      w = [];
    }
  },
      K = function K(b) {
    if (b.cancelable) {
      var a = (1E12 < b.timeStamp ? new Date() : performance.now()) - b.timeStamp;
      "pointerdown" == b.type ? function (g, c) {
        var d = function d() {
          I(g, c);
          e();
        },
            f = function f() {
          e();
        },
            e = function e() {
          document.removeEventListener("pointerup", d, v);
          document.removeEventListener("pointercancel", f, v);
        };

        document.addEventListener("pointerup", d, v);
        document.addEventListener("pointercancel", f, v);
      }(a, b) : I(a, b);
    }
  },
      G = function G(b) {
    ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (a) {
      return b(a, K, v);
    });
  },
      B = {};

  return q.getCLS = function (b, a) {
    F || (E(function (l) {
      A = l.value;
    }), F = !0);

    var g,
        c = function c(l) {
      -1 < A && b(l);
    },
        d = m("CLS", 0),
        f = 0,
        e = [],
        k = function k(l) {
      if (!l.hadRecentInput) {
        var L = e[0],
            M = e[e.length - 1];
        f && 1E3 > l.startTime - M.startTime && 5E3 > l.startTime - L.startTime ? (f += l.value, e.push(l)) : (f = l.value, e = [l]);
        f > d.value && (d.value = f, d.entries = e, g());
      }
    },
        h = x("layout-shift", k);

    h && (g = p(c, d, a), y(function () {
      h.takeRecords().map(k);
      g(!0);
    }), t(function () {
      f = 0;
      A = -1;
      d = m("CLS", 0);
      g = p(c, d, a);
    }));
  }, q.getFCP = E, q.getFID = function (b, a) {
    var g = z(),
        c = m("FID"),
        d = function d(k) {
      k.startTime < g.firstHiddenTime && (c.value = k.processingStart - k.startTime, c.entries.push(k), e(!0));
    },
        f = x("first-input", d);

    var e = p(b, c, a);
    f && y(function () {
      f.takeRecords().map(d);
      f.disconnect();
    }, !0);
    f && t(function () {
      c = m("FID");
      e = p(b, c, a);
      w = [];
      r = -1;
      n = null;
      G(document.addEventListener);
      w.push(d);
      H();
    });
  }, q.getLCP = function (b, a) {
    var g = z(),
        c = m("LCP"),
        d = function d(h) {
      var l = h.startTime;
      l < g.firstHiddenTime && (c.value = l, c.entries.push(h), e());
    },
        f = x("largest-contentful-paint", d);

    if (f) {
      var e = p(b, c, a);

      var k = function k() {
        B[c.id] || (f.takeRecords().map(d), f.disconnect(), B[c.id] = !0, e(!0));
      };

      ["keydown", "click"].forEach(function (h) {
        document.addEventListener(h, k, {
          once: !0,
          capture: !0
        });
      });
      y(k, !0);
      t(function (h) {
        c = m("LCP");
        e = p(b, c, a);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            c.value = performance.now() - h.timeStamp;
            B[c.id] = !0;
            e(!0);
          });
        });
      });
    }
  }, q.getTTFB = function (b) {
    var a = m("TTFB");

    var g = function g() {
      try {
        var c;

        if (!(c = performance.getEntriesByType("navigation")[0])) {
          var d = performance.timing,
              f = {
            entryType: "navigation",
            startTime: 0
          },
              e;

          for (e in d) {
            "navigationStart" !== e && "toJSON" !== e && (f[e] = Math.max(d[e] - d.navigationStart, 0));
          }

          c = f;
        }

        (a.value = a.delta = c.responseStart, 0 > a.value || a.value > performance.now()) || (a.entries = [c], b(a));
      } catch (k) {}
    };

    "complete" === document.readyState ? setTimeout(g, 0) : document.addEventListener("load", function () {
      return setTimeout(g, 0);
    });
  }, Object.defineProperty(q, "__esModule", {
    value: !0
  }), q;
}({});
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/TimeOnPage.js


var time_initialized;
var TimeOnPage = {
  event_name: "time_on_page_30s",
  initialize: function initialize() {
    time_initialized = new Date().getTime();
    BasicEventsModule.register(this);
  },
  init_event: function initTOS() {
    setTimeout(initEvent, getRemainingTime());
  }
};

function getRemainingTime() {
  var now = new Date().getTime();
  var current = now - time_initialized;
  var remaining = 30000 - current;
  return remaining >= 0 ? remaining : 0;
}

function initEvent() {
  var event = EventsModule.create("time_on_page_30s");
  event.addAttribute("event_category", "CONSTANT", "Time On Page");
  event.addAttribute("event_action", "CONSTANT", "30 sec");
  event.addAttribute("event_label", "CONSTANT", "none");
  event.addAttribute("non_interaction", "CONSTANT", true);
  event.addTrigger({
    "type": "CALLBACK"
  }).fire();
}
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/Error404.js


var Error404 = {
  "event_name": "404_error",
  initialize: function initialize() {
    BasicEventsModule.register(this);
  },
  init_event: check404
};

function check404() {
  // 404 page: https://www.veluxshop.hu/termekek/filter=lightdimming
  var xhr = new XMLHttpRequest();

  xhr.onload = function (e) {
    if (xhr.status == 404) sendError();
  };

  xhr.onerror = function (e) {
    sendError();
  };

  xhr.open('HEAD', document.location.href, true);

  try {
    xhr.send();
  } catch (err) {}
}

function sendError() {
  var event = EventsModule.create("404_error");
  event.addAttribute("event_category", "CONSTANT", "Page not found");
  event.addAttribute("event_action", "CONSTANT", "none");
  event.addAttribute("event_label", "CONSTANT", "none");
  event.addAttribute("non_interaction", "CONSTANT", true);
  event.addTrigger({
    "type": "CALLBACK"
  }).fire();
}
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/PageView.js



var PageView = {
  event_name: "page_view",
  initialize: function initialize() {
    BasicEventsModule.register(this);
  },
  init_event: function init_event() {
    ObserverModule_ObserverModule.addPushListener(sendPageView, "pageviewinit", {
      "activation_event": "new_spa_page",
      "execute_once": false,
      "past_events": true
    });
    sendPageView();
  }
};

function sendPageView() {
  var event = EventsModule.create("page_view");
  event.addTrigger({
    "type": "PAGE_VIEW"
  });
}
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/UserData.js




var UserData_config;
var user_data_cookies = {
  "user_fb_id": {
    "platform": "fb",
    "cookie": "_fbp"
  },
  "user_hubspot_id_1": {
    "pixel": "hubspot",
    "cookie": "__hstc"
  },
  "user_hubspot_id_2": {
    "pixel": "hubspot",
    "cookie": "hubspotutk"
  },
  "user_microsoft_id": {
    "platform": "bing",
    "cookie": "MUID"
  },
  "user_bing_id": {
    "platform": "bing",
    "cookie": "_uetvid"
  }
};
var UserData = {
  event_name: "user_data",
  initialize: function initialize() {
    UserData_config = UserData_config || _get("config");
    user_data_cookies.user_data_hotjar_user_id = {
      "pixel": "hotjar",
      "cookie": "_hjSessionUser_" + UserData_config.single_pixels.hotjar
    };
    BasicEventsModule.register(this);
  },
  init_event: initUserDataEvent
};

function initUserDataEvent() {
  var tracking_options = {
    "whitelist": ["ga4", "gua"]
  };
  var event = EventsModule.create("user_data", tracking_options);
  event.addAttribute("event_category", "CONSTANT", "user_data");
  event.addAttribute("event_action", "CONSTANT", "none");
  event.addAttribute("event_label", "CONSTANT", "none");
  event.addAttribute("non_interaction", "CONSTANT", true);

  var _gid_cookie = _getCookie("_gid");

  if (_gid_cookie) {
    event.addAttribute("user_google_gid", "CONSTANT", _gid_cookie.split(".").slice(-2).join("."));
  }

  var queries = _parseHref(document.location && document.location.href, true).queries;

  if (queries && queries.gclid) {
    event.addAttribute("user_google_gclid", "CONSTANT", queries.gclid);
  }

  if (queries && queries.fbclid) {
    event.addAttribute("user_fb_fbclid", "CONSTANT", queries.fbclid);
  }

  for (var attribute_name in user_data_cookies) {
    var data_obj = user_data_cookies[attribute_name];

    if (cookiePresent(data_obj)) {
      event.addAttribute(attribute_name, "JS_FUNCTION", _getCookie.bind(null, data_obj.cookie));
    }
  }

  event.addTrigger({
    "type": "CALLBACK"
  }).fire();
}

function cookiePresent(cookie_data) {
  if ("platform" in cookie_data) {
    return isPlatformPresent(cookie_data.platform);
  }

  if ("pixel" in cookie_data) {
    return isPixelPresent(cookie_data.pixel);
  }
}

function isPlatformPresent(platform_key) {
  return platform_key in UserData_config.tracking_pixels;
}

function isPixelPresent(pixel_key) {
  return UserData_config.single_pixels && pixel_key in UserData_config.single_pixels;
}
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/LetsStart.js



var LetsStart = {
  event_name: "__lets_start__",
  initialize: function initialize() {
    BasicEventsModule.register(this);
  },
  init_event: function init_event() {
    var single_pixels = _get("config.single_pixels");

    var single_pixels_platofrms = Object.keys(single_pixels).reduce(function (all, platform) {
      var current = single_pixels[platform];
      return current.getPixelAttributes() ? all.concat(current.platform) : all;
    }, []);
    var event = EventsModule.create("__lets_start__");
    event.addAttribute("consent_categories", "JS_FUNCTION", function () {
      return _get("consent").split("|");
    }).doNotCache();
    event.addAttribute("platfroms", "CONSTANT", single_pixels_platofrms);
    event.addTrigger({
      "type": "PAGE_VIEW"
    });
  }
};
;// CONCATENATED MODULE: ./framework/8_1_basicEvents/_module/BasicEventsModule.js









var initializers = [];
var BasicEventsModule_config;
var BasicEventsModule = {
  initialize: function initialize() {
    BasicEventsModule_config = _get("config");
    LetsStart.initialize();
    PageView.initialize();
    setTimeout(function () {
      PageLoadTime.initialize();
      WebVitalsListener.initialize();
      TimeOnPage.initialize();
      Error404.initialize();
      UserData.initialize(); // @todo refactor ( initializers should be sent to system scheduler )

      initializers.forEach(function (initFn) {
        initFn();
      });
    });
  },
  register: function register(event_handler) {
    if (!_isStr(event_handler.event_name) || !_getType_isFn(event_handler.init_event)) {
      _error("Insufficient event handler");
    }

    if (!_usagePermissionGranted(event_handler.event_name, BasicEventsModule_config.event_permissions)) {
      return false;
    }

    if (event_handler.event_name === "page_view") {
      return event_handler.init_event();
    } else initializers.push(event_handler.init_event);

    return true;
  }
};
;// CONCATENATED MODULE: ./framework/9_8_startup/startUpStep2.js


function startUpStep2() {
  EventsModule.initialize();
  BasicEventsModule.initialize();
}
;// CONCATENATED MODULE: ./framework/9_8_startup/startUpStep3.js


function startUpStep3() {
  EcomEventsModule.initialize();
  TaggingController.scheduleTagging();
}
;// CONCATENATED MODULE: ./framework/9_8_startup/StartupHandler.js




var StartupHandler = {
  initialize: function initialize(raw_config) {
    try {
      ConfigHandler.initialize(raw_config);
      startUpStep1();
      sendReadyEvent();
      startUpStep2();
      startUpStep3();
    } catch (err) {
      if (!raw_config.debugMode) {
        sendErrorBeacon();
      } else {
        console.error("Assistant startup error: " + err.message);
        throw err;
      }
    }
  }
};

var sendReadyEvent = function sendReadyEvent() {
  var ready_event = document.createEvent('Event');
  ready_event.initEvent('gtm_assistant_ready', true, true);
  document.dispatchEvent(ready_event);
};

function sendErrorBeacon() {
  navigator.sendBeacon("https://www.google-analytics.com/mp/collect?measurement_id=G-D2ZJ2NRE85&api_secret=KuaFuiPqQY-J7ZMjYZG_1Q", JSON.stringify({
    "client_id": "xxxx",
    "events": [{
      name: "assistant startup error",
      params: {
        hostname: document.location.hostname,
        page_path: document.location.pathname
      }
    }]
  }));
}

;
;// CONCATENATED MODULE: ./framework/index.js

window.init_gtm_assistant = StartupHandler.initialize;
/******/ })()
;
