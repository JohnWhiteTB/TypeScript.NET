/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","../../Compare"],function(r,e,a,n){function t(r){return Array.isArray(r)?r:[r]}function u(r,e,u){void 0===e&&(e=1),void 0===u&&(u=NaN);var i=!a["default"].isTrueNaN(u);return function(f,o){for(var l=t(r(f)),N=t(r(o)),d=Math.min(l.length,N.length),s=Array.isArray(e)?e:null,c=0;d>c;c++){var v=l[c],y=N[c],p=s?c<s.length?s[c]:1:e;i&&(a["default"].isTrueNaN(v)&&(v=u),a["default"].isTrueNaN(y)&&(y=u));var h=n.compare(v,y);if(0!==h)return p*h}return 0}}e.createComparer=u,e["default"]=u,e.by=u});
//# sourceMappingURL=Sort.js.map
