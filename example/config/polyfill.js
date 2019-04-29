if (!String.prototype.startsWith) {
  require('core-js/fn/string/starts-with');
}

if (!window.Promise) {
  require('core-js/fn/promise');
}

if (!window.Map) {
  require('core-js/fn/map');
}

if (!window.Set) {
  require('core-js/fn/set');
}

if (!Object.setPrototypeOf) {
  require('core-js/fn/object/set-prototype-of');
}
