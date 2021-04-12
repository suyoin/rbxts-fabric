# @rbxts/fabric

roblox-ts typings for evaera's Fabric.

`npm i @rbxts/fabric @rbxts/t`

[![NPM](https://nodei.co/npm/@rbxts/fabric.png)](https://npmjs.org/package/@rbxts/fabric)

# Modifications

    Modifications I have made to the original package

- Quick fix to https://github.com/evaera/Fabric/issues/55

# Usage

`ExampleUnit.ts`

```ts
import { Fabric, UnitDefinition, ThisFabricUnit } from "@rbxts/fabric";

const fabric = new Fabric("game");

declare global {
	interface FabricUnits {
		ExampleUnit: ExampleUnitDefinition;
	}
}

//NOTE: you should never define the `name` field here. `name` should always be the same as the key in `FabricUnits`, which is done automatically for you.
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

fabric.registerUnit(exampleUnitDefinition);

const unit = fabric.getOrCreateUnitByRef("ExampleUnit", game); //attach an ExampleUnit to `game`
unit.foo();
print(unit.data!.bar); // > true
```

# Changelog

### 1.1.3

    - Rollback fix for #3 (`getUnit` and `getOrCreateUnit`, as well as `UnitDefinition.units` ref validity)

### 1.1.2

    - Fix PickByUnitRef

### 1.1.1

    - `Unit.getUnit` and `Unit.getOrCreateUnit` now check for ref validity
    - `UnitDefinition.units` now checks for ref validity and uses the `_addLayerData` type if applicable
    - Members of `Reducers`, `Symbol`, and `SinglePromiseEvent` now show in intellisense
    - `RoactUnitProps<TInstance, TFabricUnitNames>` exposed, can be used to intersect Roact props
    - Unit data is no longer automatically made Partial<TData>
    - Reorganized types

### 1.0.0

    - Initial release
