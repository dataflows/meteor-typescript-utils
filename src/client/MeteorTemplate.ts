///<reference path="../../typings/meteor/meteor.d.ts"/>
///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/lodash/lodash.d.ts"/>

module meteortypescript {

    export module MeteorTemplate {

        interface IMeteorContextMember extends Function {
            __meteorEventMatcher__?: string;
            __isMeteorHelper__?: boolean;
        }

        export interface IEventHandler<T> {
            (event: Meteor.Event, template: IBlaze<T>): void
        }

        export function event(eventMatcher: string) {
            return function(target: Function, key: string, value: any): any {
                var decoratedFun: IMeteorContextMember = <any> value.value;
                decoratedFun.__meteorEventMatcher__ = eventMatcher;
                return { value: decoratedFun };
            };
        }

        export function helper(target: Function, key: string, value: any): any {
            var decoratedFun: IMeteorContextMember = <any> value.value;
            decoratedFun.__isMeteorHelper__ = true;
            return { value: decoratedFun };
        }

        export class Base<T> {
            constructor(
                public name: string,
                public context: T) {}

            // This properties are injected by Meteor.
            protected data: T;
            protected $: JQueryStatic;
        }


        export interface IEventsMap<T> {
            [event: string]: IEventHandler<T>
        }

        export interface IMeteorTemplate<T> {
            name: string;
            context: T;
            rendered?: () => void;
        }

        export interface IBlaze<T> extends Blaze.Template {
            data: T;
        }

        export function register<T>(template: IMeteorTemplate<T>) {
            var templateContextObj = <any>template.context;
            var contextFunctionNames = lodash.functions(template.context);
            var contextFunctions = lodash.map(contextFunctionNames, (funName: string) => templateContextObj[funName]);
            var contextFunctionsWithNames = lodash.map(contextFunctionNames, (funName: string) => [funName, templateContextObj[funName]]);

            var contextEventFunctions = lodash.filter(contextFunctions,
                (fun: IMeteorContextMember): boolean => !!fun.__meteorEventMatcher__);
            var events: IEventsMap<T> = lodash.indexBy(contextEventFunctions,
                (fun: IMeteorContextMember): string => fun.__meteorEventMatcher__);

            var contextHelperFunctions = lodash.filter(contextFunctionsWithNames,
                (fun: [string, IMeteorContextMember]): boolean => fun[1].__isMeteorHelper__);
            var helpersWithNames = lodash.indexBy(contextHelperFunctions, (fun: [string, IMeteorContextMember]): string => fun[0]);
            var helpers = lodash.mapValues(helpersWithNames, (fun: [string, IMeteorContextMember]): IMeteorContextMember => fun[1]);

            Template[template.name].events(events);
            Template[template.name].helpers(helpers);
            if (template.rendered) {
                Template[template.name].rendered = template.rendered;
            }
        }
    }
}
