///<reference path="../../typings/meteor/ironrouter.d.ts"/>

module meteortypescript {
    export class RouteControllerBase<RouteParams> {
        protected ready: () => boolean; // Injected by iron:router
        protected redirect: (route: string) => boolean; // Injected by iron:router
        protected render: (name: string) => void; // Injected by iron:router
        protected params: RouteParams; // Injected by iron:router
    }
}
