function pluginInit() {
  //-------------------------------------------------------------
  // In some older browsers do not implement these methods.
  // For example, Android 4.4 does not have Array.map()
  //
  // But this plugin needs them.
  // That's why if the browser does not have it, implement it.
  //-------------------------------------------------------------
  if (typeof Array.prototype.forEach !== "function") {
    (function() {
      Array.prototype.forEach = function(fn, thisArg) {
        thisArg = thisArg || this;
        for (var i = 0; i < this.length; i++) {
          fn.call(thisArg, this[i], i, this);
        }
      };
    })();
  }
  if (typeof Array.prototype.filter !== "function") {
    (function() {
      Array.prototype.filter = function(fn, thisArg) {
        thisArg = thisArg || this;
        var results = [];
        for (var i = 0; i < this.length; i++) {
          if (fn.call(thisArg, this[i], i, this) === true) {
            results.push(this[i]);
          }
        }
        return results;
      };
    })();
  }
  if (typeof Array.prototype.map !== "function") {
    (function() {
      Array.prototype.map = function(fn, thisArg) {
        thisArg = thisArg || this;
        var results = [];
        for (var i = 0; i < this.length; i++) {
          results.push(fn.call(thisArg, this[i], i, this));
        }
        return results;
      };
    })();
  }

  /*****************************************************************************
   * To prevent strange things happen,
   * disable the changing of viewport zoom level by double clicking.
   * This code has to run before the device ready event.
   *****************************************************************************/
  var viewportTag = null;
  var metaTags = document.getElementsByTagName('meta');
  for (var i = 0; i < metaTags.length; i++) {
      if (metaTags[i].getAttribute('name') === "viewport") {
          viewportTag = metaTags[i];
          break;
      }
  }
  if (!viewportTag) {
      viewportTag = document.createElement("meta");
      viewportTag.setAttribute('name', 'viewport');
  }

  var viewportTagContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no';

  // Detect if iOS device
  if (/(iPhone|iPod|iPad)/i.test(window.navigator.userAgent)) {
    // Get iOS major version
    var iosVersion = parseInt((window.navigator.userAgent).match(/OS (\d+)_(\d+)_?(\d+)? like Mac OS X/i)[1]);
    // Detect if device is running >iOS 11
    // iOS 11's UIWebView and WKWebView changes the viewport behaviour to render viewport without the status bar. Need to override with "viewport-fit: cover" to include the status bar.
    if (iosVersion >= 11) {
      viewportTagContent += ', viewport-fit=cover';
    }
  }

  // Update viewport tag attribute
  viewportTag.setAttribute('content', viewportTagContent);


  /*****************************************************************************
   * Prevent background, background-color, background-image properties
   *****************************************************************************/
  var navDecorBlocker = document.createElement("style");
  navDecorBlocker.setAttribute("type", "text/css");
  navDecorBlocker.innerText = [
    "html, body, ._gmaps_cdv_ {",
    "   background-image: url() !important;",
    "   background: rgba(0,0,0,0) url() !important;",
    "   background-color: rgba(0,0,0,0) !important;",
    "}",
    "._gmaps_cdv_ .nav-decor {",
    "   background-color: rgba(0,0,0,0) !important;",
    "   background: rgba(0,0,0,0) !important;",
    "   display:none !important;",
    "}"
  ].join("");
  document.head.appendChild(navDecorBlocker);


  //----------------------------------------------
  // Set transparent mandatory for older browser
  // http://stackoverflow.com/a/3485654/697856
  //----------------------------------------------
  document.body.style.backgroundColor = "rgba(0,0,0,0)";
  //document.body.style.display='none';
  document.body.offsetHeight;
  //document.body.style.display='';
}

module.exports = pluginInit;
