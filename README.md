# Meteor Typescript utils
This package provides Typescript wrappers for core Meteor functionalities. This lets develop Meteor projects with the full type safety of Typescript.

__This is a work in progress, contributions and ideas welcome!__

Check out sample Meteor project: https://github.com/dataflows/meteor-typescript-utils-example

## What's included
1. Typescript typings for Meteor, Iron:Router, Lodash and this package (meteorts).
2. Typed wrappers for Meteor methods
3. Typed wrappers for Meteor Templates
4. Typed wrappers for Iron:Router routes

## Install
1. Add Meteor package: `meteor add dataflows:typescript-utils`.
2. Copy typings from `typings` directory into your project so that you can reference them.

## Guide

### Methods
```

# Define method:
interface ISaveClickArgs {
    name: string;
}
var SaveClick = new MeteorMethod<ISaveClickArgs, void>("SaveClick");

# Call method:
SaveClick.call({ name: name });
```

### Templates
```
class MainTemplateContext extends MainTemplateData {
    @MeteorTemplate.event("click #heybutton")
    buttonClick(event: Meteor.Event, template: Blaze.Template): void {
        // ...
    }

    @MeteorTemplate.helper
    clicksCount(): number {
        // ...
    }
}

class MainTemplate extends MeteorTemplate.Base<MainTemplateData> {
    constructor() {
        super("MainTemplate", new MainTemplateContext());
    }

    rendered(): void {
        // ...
    }
}

MeteorTemplate.register(new MainTemplate());
```

### RouteControllers
```
    export class SingleClickController extends RouteControllerBase<router.ISingleClickRouteParams> {
        public template: string = ...;

        public waitOn(): any {
            // ...
        }

        public data(): any {
            // ... this.params holds typed route params
        }
    }
```

## License
This project is provided on the MIT license.
