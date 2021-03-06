/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
System.register(['./SubscribableBase'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SubscribableBase_1;
    var ObservableNodeBase, OBSERVER_ERROR_MESSAGE;
    function processAction(observers, handler, dispose) {
        if (dispose === void 0) { dispose = true; }
        var observersErrors = null;
        for (var _i = 0; _i < observers.length; _i++) {
            var s = observers[_i];
            try {
                handler(s);
            }
            catch (ex) {
                observersErrors = observersErrors || [];
                observersErrors.push({ observer: s, ex: ex });
            }
        }
        if (dispose)
            observers.length = 0;
        if (observersErrors && observersErrors.length) {
            if (console && console.error)
                console.error(OBSERVER_ERROR_MESSAGE, observersErrors);
            else
                throw {
                    message: OBSERVER_ERROR_MESSAGE,
                    errors: observersErrors
                };
        }
    }
    return {
        setters:[
            function (SubscribableBase_1_1) {
                SubscribableBase_1 = SubscribableBase_1_1;
            }],
        execute: function() {
            ObservableNodeBase = (function (_super) {
                __extends(ObservableNodeBase, _super);
                function ObservableNodeBase() {
                    _super.apply(this, arguments);
                }
                ObservableNodeBase.prototype.onNext = function (value) {
                    processAction(this._getSubscribers(), function (s) { s.onNext && s.onNext(value); });
                };
                ObservableNodeBase.prototype.onError = function (error) {
                    processAction(this._getSubscribers(), function (s) { s.onError && s.onError(error); });
                };
                ObservableNodeBase.prototype.onCompleted = function () {
                    processAction(this._unsubscribeAll(true), function (s) { s.onCompleted && s.onCompleted(); });
                };
                return ObservableNodeBase;
            })(SubscribableBase_1.default);
            exports_1("default", ObservableNodeBase);
            OBSERVER_ERROR_MESSAGE = 'One or more observers had errors when attempting to pass information.';
        }
    }
});
//# sourceMappingURL=ObservableNodeBase.js.map