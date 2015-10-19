/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
///<reference path="IUri.d.ts"/>
///<reference path="../IEquatable.d.ts"/>
///<reference path="../Primitive.d.ts"/>
var Types_1 = require('../Types');
var QueryParams = require('../Uri/QueryParams');
var Utility_1 = require('../Text/Utility');
var Scheme_1 = require('../Uri/Scheme');
var ArgumentException_1 = require('../Exceptions/ArgumentException');
var ArgumentOutOfRangeException_1 = require('../Exceptions/ArgumentOutOfRangeException');
var Uri = (function () {
    function Uri(scheme, userInfo, host, port, path, query, fragment) {
        var _ = this;
        _.scheme = getScheme(scheme) || null;
        _.userInfo = userInfo || null;
        _.host = host || null;
        _.port = port || null;
        _.authority = _.getAuthority() || null;
        _.path = path || null;
        if (!Types_1.default.isString(query))
            query = QueryParams.encode(query);
        _.query = formatQuery(query) || null;
        Object.freeze(_.queryParams
            = _.query
                ? QueryParams.parseToMap(_.query)
                : {});
        _.pathAndQuery = _.getPathAndQuery() || null;
        _.fragment = formatFragment(fragment) || null;
        _.absoluteUri = _.getAbsoluteUri();
        Object.freeze(_);
    }
    Uri.prototype.equals = function (other) {
        return this.absoluteUri == Uri.toString(other);
    };
    Uri.from = function (url) {
        var uri = (!url || Types_1.default.isString(url))
            ? Uri.parse(url) : url;
        return new Uri(uri.scheme, uri.userInfo, uri.host, uri.port, uri.path, uri.query, uri.fragment);
    };
    Uri.parse = function (url, throwIfInvalid) {
        if (throwIfInvalid === void 0) { throwIfInvalid = true; }
        var result = null;
        var ex = tryParse(url, function (out) { result = out; });
        if (throwIfInvalid && ex)
            throw ex;
        return result;
    };
    Uri.tryParse = function (url, out) {
        return !tryParse(url, out);
    };
    Uri.copyOf = function (map) {
        return copyUri(map);
    };
    Uri.prototype.copyTo = function (map) {
        return copyUri(this, map);
    };
    Uri.prototype.getAbsoluteUri = function () {
        return uriToString(this);
    };
    Uri.prototype.getAuthority = function () {
        return getAuthority(this);
    };
    Uri.prototype.getPathAndQuery = function () {
        return getPathAndQuery(this);
    };
    Object.defineProperty(Uri.prototype, "pathSegments", {
        get: function () {
            return this.path.match(/^[/]|[^/]*[/]|[^/]+$/g);
        },
        enumerable: true,
        configurable: true
    });
    Uri.prototype.toMap = function () {
        return this.copyTo({});
    };
    Uri.prototype.toString = function () {
        return this.absoluteUri;
    };
    Uri.toString = function (uri) {
        return uri instanceof Uri
            ? uri.absoluteUri
            : uriToString(uri);
    };
    Uri.getAuthority = function (uri) {
        return getAuthority(uri);
    };
    return Uri;
})();
var Uri;
(function (Uri) {
    (function (Fields) {
        Fields[Fields["scheme"] = 0] = "scheme";
        Fields[Fields["userInfo"] = 1] = "userInfo";
        Fields[Fields["host"] = 2] = "host";
        Fields[Fields["port"] = 3] = "port";
        Fields[Fields["path"] = 4] = "path";
        Fields[Fields["query"] = 5] = "query";
        Fields[Fields["fragment"] = 6] = "fragment";
    })(Uri.Fields || (Uri.Fields = {}));
    var Fields = Uri.Fields;
    Object.freeze(Fields);
})(Uri || (Uri = {}));
function copyUri(from, to) {
    if (to === void 0) { to = {}; }
    var i = 0, field;
    while (field = Uri.Fields[i++]) {
        var value = from[field];
        if (value)
            to[field] = value;
    }
    return to;
}
var SLASH = '/', SLASH2 = '//', QM = '?', HASH = '#', EMPTY = '', AT = '@';
function getScheme(scheme) {
    var s = scheme;
    if (Types_1.default.isString(s)) {
        if (!s)
            return undefined;
        s = Scheme_1.default[Utility_1.trim(s).toLowerCase().replace(/[^a-z0-9+.-]+$/g, EMPTY)];
        if (isNaN(s))
            throw new ArgumentOutOfRangeException_1.default('scheme', scheme, 'Invalid scheme.');
    }
    if (Types_1.default.isNumber(s, false)) {
        s = Scheme_1.default[s];
        if (!s)
            throw new ArgumentOutOfRangeException_1.default('scheme', scheme, 'Invalid scheme.');
        return s;
    }
    return undefined;
}
function getAuthority(uri) {
    if (!uri.host) {
        if (uri.userInfo)
            throw new ArgumentException_1.default('host', 'Cannot include user info when there is no host.');
        if (Types_1.default.isNumber(uri.port, false))
            throw new ArgumentException_1.default('host', 'Cannot include a port when there is no host.');
    }
    var result = uri.host || EMPTY;
    if (result) {
        if (uri.userInfo)
            result = uri.userInfo + AT + result;
        if (!isNaN(uri.port))
            result += ':' + uri.port;
        result = SLASH2 + result;
    }
    return result;
}
function formatQuery(query) {
    return query && ((query.indexOf(QM) == -1 ? QM : EMPTY) + query);
}
function formatFragment(fragment) {
    return fragment && ((fragment.indexOf(HASH) == -1 ? HASH : EMPTY) + fragment);
}
function getPathAndQuery(uri) {
    var path = uri.path, query = uri.query;
    return EMPTY
        + (path && ((path.indexOf(SLASH) == -1 ? SLASH : EMPTY) + path) || EMPTY)
        + (formatQuery(query) || EMPTY);
}
function uriToString(uri) {
    // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
    // {scheme}{authority}{path}{query}{fragment}
    var scheme = getScheme(uri.scheme), authority = getAuthority(uri), pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
    return EMPTY
        + ((scheme && (scheme + ':')) || EMPTY)
        + (authority || EMPTY)
        + (pathAndQuery || EMPTY)
        + (fragment || EMPTY);
}
function tryParse(url, out) {
    if (!url)
        return new ArgumentException_1.default('url', 'Nothing to parse.');
    var i, result = {};
    i = url.indexOf(HASH);
    if (i != -1) {
        result.fragment = url.substring(i);
        url = url.substring(0, i);
    }
    i = url.indexOf(QM);
    if (i != -1) {
        result.query = url.substring(i);
        url = url.substring(0, i);
    }
    i = url.indexOf(SLASH2);
    if (i != -1) {
        var scheme = Utility_1.trim(url.substring(0, i)), c = /:$/;
        if (!c.test(scheme))
            return new ArgumentException_1.default('url', 'Scheme was improperly formatted');
        scheme = Utility_1.trim(scheme.replace(c, EMPTY));
        result.scheme = scheme || undefined;
        url = url.substring(i + 2);
    }
    i = url.indexOf(SLASH);
    if (i != -1) {
        result.path = url.substring(i) || undefined;
        url = url.substring(0, i);
    }
    i = url.indexOf(AT);
    if (i != -1) {
        result.userInfo = url.substring(0, i) || undefined;
        url = url.substring(i + 1);
    }
    i = url.indexOf(':');
    if (i != -1) {
        var port = parseInt(Utility_1.trim(url.substring(i + 1)));
        if (isNaN(port))
            return new ArgumentException_1.default('url', 'Port was invalid.');
        result.port = port;
        url = url.substring(0, i);
    }
    url = Utility_1.trim(url);
    if (url)
        result.host = url;
    out(copyUri(result));
    return null;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Uri;
//# sourceMappingURL=Uri.js.map