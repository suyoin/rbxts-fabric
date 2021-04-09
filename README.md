# @rbxts/fabric

`npm i @rbxts/fabric @rbxts/t`

# Modifications

    Some modifications I have made to the original package

- Added a `heartbeatInterval` batching function
- Quick fix to https://github.com/evaera/Fabric/issues/55

# Usage

`ExampleUnit.ts`

```ts
import { UnitDefinition, ThisFabricUnit } from "@rbxts/fabric";

declare global {
	interface FabricUnits {
		ExampleUnit: ExampleUnitDefinition;
	}
}

interface ExampleUnitDefinition extends UnitDefinition<"ExampleUnit"> {
	//these three fields are for typing only, and they have to be optional so that the below implementation does not have to define them
	data?: { bar: boolean };
	_addLayerData?: { bar: true }; //if `_addLayerData` is not specified, `data` will be used.
	ref?: Player;

	foo(this: ThisFabricUnit<"ExampleUnit">): void;
}

const exampleUnitDefinition: ExampleUnitDefinition = {
	name: "ExampleUnit",

	foo() {
		this.addLayer("exampleScope", { bar: true }); //here, `bar` must equal `true`.

		//hypothetically, if `_addLayerData` was not specified, then `bar` would be able to be `true` OR `false`, since those are of type `boolean`.
	},
};

export = exampleUnitDefinition;
```

# Changelog

### 1.0.0

    - Initial release
