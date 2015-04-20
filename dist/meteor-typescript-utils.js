///<reference path="../../typings/meteor/meteor.d.ts"/>
///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/lodash/lodash.d.ts"/>
var meteortypescript;
(function (meteortypescript) {
    var MeteorTemplate;
    (function (MeteorTemplate) {
        function event(eventMatcher) {
            return function (target, key, value) {
                var decoratedFun = value.value;
                decoratedFun.__meteorEventMatcher__ = eventMatcher;
                return { value: decoratedFun };
            };
        }
        MeteorTemplate.event = event;
        function helper(target, key, value) {
            var decoratedFun = value.value;
            decoratedFun.__isMeteorHelper__ = true;
            return { value: decoratedFun };
        }
        MeteorTemplate.helper = helper;
        var Base = (function () {
            function Base(name, context) {
                this.name = name;
                this.context = context;
            }
            return Base;
        })();
        MeteorTemplate.Base = Base;
        function register(template) {
            var templateContextObj = template.context;
            var contextFunctionNames = lodash.functions(template.context);
            var contextFunctions = lodash.map(contextFunctionNames, function (funName) { return templateContextObj[funName]; });
            var contextFunctionsWithNames = lodash.map(contextFunctionNames, function (funName) { return [funName, templateContextObj[funName]]; });
            var contextEventFunctions = lodash.filter(contextFunctions, function (fun) { return !!fun.__meteorEventMatcher__; });
            var events = lodash.indexBy(contextEventFunctions, function (fun) { return fun.__meteorEventMatcher__; });
            var contextHelperFunctions = lodash.filter(contextFunctionsWithNames, function (fun) { return fun[1].__isMeteorHelper__; });
            var helpersWithNames = lodash.indexBy(contextHelperFunctions, function (fun) { return fun[0]; });
            var helpers = lodash.mapValues(helpersWithNames, function (fun) { return fun[1]; });
            Template[template.name].events(events);
            Template[template.name].helpers(helpers);
            if (template.rendered) {
                Template[template.name].rendered = template.rendered;
            }
        }
        MeteorTemplate.register = register;
    })(MeteorTemplate = meteortypescript.MeteorTemplate || (meteortypescript.MeteorTemplate = {}));
})(meteortypescript || (meteortypescript = {}));
///<reference path="../../typings/meteor/meteor.d.ts"/>
var meteortypescript;
(function (meteortypescript) {
    var MeteorMethod = (function () {
        function MeteorMethod(name) {
            this.name = name;
        }
        // TOOD(marek): Consider migrating this to promises.
        MeteorMethod.prototype.call = function (args, callback) {
            Meteor.call(this.name, args, callback);
        };
        return MeteorMethod;
    })();
    meteortypescript.MeteorMethod = MeteorMethod;
    var MeteorMethod;
    (function (MeteorMethod) {
        // This provides typing for stuff injected by Meteor.
        var BaseMixin = (function () {
            function BaseMixin() {
            }
            BaseMixin.prototype.unblock = function () { };
            return BaseMixin;
        })();
        MeteorMethod.BaseMixin = BaseMixin;
        function register(method, impl) {
            var updater = {};
            updater[method.name] = function (args) {
                return impl.apply.call(this, args);
            };
            Meteor.methods(updater);
        }
        MeteorMethod.register = register;
    })(MeteorMethod = meteortypescript.MeteorMethod || (meteortypescript.MeteorMethod = {}));
})(meteortypescript || (meteortypescript = {}));
///<reference path="../../typings/meteor/ironrouter.d.ts"/>
var meteortypescript;
(function (meteortypescript) {
    var RouteControllerBase = (function () {
        function RouteControllerBase() {
        }
        return RouteControllerBase;
    })();
    meteortypescript.RouteControllerBase = RouteControllerBase;
})(meteortypescript || (meteortypescript = {}));
/// <reference path='./client/MeteorTemplate'/>
/// <reference path='./shared/MeteorMethod'/>
/// <reference path='./shared/RouteControllerBase'/>
meteorts = meteortypescript;
