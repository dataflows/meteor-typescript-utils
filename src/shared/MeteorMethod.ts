///<reference path="../../typings/meteor/meteor.d.ts"/>

module meteortypescript {

    export interface IMeteorCallback<Returns> {
        (error: Meteor.Error, result: Returns): void
    }

    export class MeteorMethod<Args, Returns> {
        constructor(public name: string) {}
        // TOOD(marek): Consider migrating this to promises.
        call(args: Args, callback?: IMeteorCallback<Returns>): void {
            Meteor.call(this.name, args, callback);
        }
    }

    export module MeteorMethod {

        export interface Impl<Args, Returns> {
            apply(args: Args): Returns;
        }

        // This provides typing for stuff injected by Meteor.
        export class BaseMixin {
            unblock(): void {}
        }

        export function register<Args, Returns>(method: MeteorMethod<Args, Returns>, impl: Impl<Args, Returns>) {
            let updater: any = {};
            updater[method.name] = function(args: Args): Returns {
                return impl.apply.call(this, args);
            };
            Meteor.methods(updater);
        }
    }
}
