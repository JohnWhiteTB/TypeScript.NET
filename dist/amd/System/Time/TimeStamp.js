/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./HowMany","../Types"],function(e,t,i,n){var o=function(){function e(e,t,i,n,o,s,r,a){void 0===i&&(i=1),void 0===n&&(n=0),void 0===o&&(o=0),void 0===s&&(s=0),void 0===r&&(r=0),void 0===a&&(a=0),this.year=e,this.month=t,this.day=i,this.hour=n,this.minute=o,this.second=s,this.millisecond=r,this.tick=a,Object.freeze(this)}return e.prototype.toJsDate=function(){var e=this;return new Date(e.year,e.month,e.day,e.hour,e.minute,e.second,e.millisecond+e.tick/1e4)},e.from=function(t){if(!n["default"].isInstanceOf(t,Date)&&n["default"].hasMember(t,"toJsDate")&&(t=t.toJsDate()),n["default"].isInstanceOf(t,Date))return new e(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds());throw Error("Invalid date type.")},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=o});
//# sourceMappingURL=TimeStamp.js.map
