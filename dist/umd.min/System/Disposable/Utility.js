/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,n){if("object"==typeof module&&"object"==typeof module.exports){var t=n(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(e,n)}(["require","exports","../Types"],function(e,n){function t(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];s(e,!1)}function r(){for(var e=[],n=0;n<arguments.length;n++)e[n-0]=arguments[n];return s(e,!0)}function i(e,n){return e&&e.length?s(e.slice(),n):null}function o(e,n){try{return n(e)}finally{u(e,!1)}}function u(e,n){if(f["default"].of(e).member("dispose").isFunction)if(n)try{e.dispose()}catch(t){return t}else e.dispose();return null}function s(e,n,t){void 0===t&&(t=0);for(var r,i=e.length;i>t;t++){var o=e[t];if(o)if(n){var f=u(o,!0);f&&(r||(r=[]),r.push(f))}else{var l=!1;try{u(o,!1),l=!0}finally{!l&&i>t+1&&s(e,!1,t+1)}if(!l)break}}return r}var f=e("../Types");n.dispose=t,n.disposeWithoutException=r,n.disposeThese=i,n.using=o});
//# sourceMappingURL=Utility.js.map
