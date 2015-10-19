/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var Types_1 = require('../Types');
exports.EMPTY = '';
function escapeRegExp(source) {
    return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
exports.escapeRegExp = escapeRegExp;
function trim(source, chars, ignoreCase) {
    if (chars) {
        if (chars === exports.EMPTY)
            return source;
        var escaped = escapeRegExp(chars instanceof Array ? chars.join() : chars);
        return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase ? 'i' : '')), exports.EMPTY);
    }
    return source.replace(/^\s+|\s+$/g, exports.EMPTY);
}
exports.trim = trim;
function format(source) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return supplant(source, args);
}
exports.format = format;
function supplant(source, params) {
    var oIsArray = params instanceof Array;
    return source.replace(/\{([^{}]*)\}/g, function (a, b) {
        var n = b;
        if (oIsArray) {
            var i = parseInt(b);
            if (!isNaN(i))
                n = i;
        }
        var r = params[n];
        switch (typeof r) {
            case Types_1.default.STRING:
            case Types_1.default.NUMBER:
            case Types_1.default.BOOLEAN:
                return r;
            default:
                return a;
        }
    });
}
exports.supplant = supplant;
//# sourceMappingURL=Utility.js.map