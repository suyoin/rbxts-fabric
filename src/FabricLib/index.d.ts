import Fabric from "./Fabric";
import useTags from "./Tags";
import useReplication from "./Replication";
import useRoact from "./Roact";
import useBatching from "./Batching";
import useServiceUnits from "./ServiceUnits";
import Unit from "./Fabric/Unit";
import { UnitDefinition } from "./Fabric/Types";

import * as Symbol from "./Shared/Symbol";
import * as Reducers from "./Fabric/Operators/Reducers";
import * as SinglePromiseEvent from "./Batching/SinglePromiseEvent";

declare global {
	interface FabricUnits {}
}

declare namespace FabricLib {
	export type LiteralUnion<T extends string> = T | (Pick<string, never> & { _?: never });
	export type NonNullableObject<T> = {
		[K in keyof T]: T[K] extends undefined ? never : T[K];
	};
	export type ThisFabricUnit<T extends keyof FabricUnits> = Unit<T> & FabricUnits[T];

	export type UnitsThatExtendUnitRef<
		TUnitName extends keyof FabricUnits,
		TRef extends ThisFabricUnit<TUnitName>
	> = keyof ExcludeMembers<
		{
			[P in keyof Omit<FabricUnits, TRef["name"]>]: Required<FabricUnits[P]>["ref"] extends ThisFabricUnit<
				keyof FabricUnits
			>
				? FabricUnits[P]
				: never;
		},
		never
	>;

	export type PickByUnitRef<TUnitName extends keyof FabricUnits, TRef extends ThisFabricUnit<TUnitName>> = keyof {
		[P in UnitsThatExtendUnitRef<TUnitName, TRef>]: TRef extends Required<FabricUnits[P]>["ref"]
			? FabricUnits[P]
			: never;
	};

	export type PickByInstanceRef<TRef extends Instance> = {
		[P in keyof FabricUnits]: TRef extends Required<FabricUnits[P]>["ref"] ? FabricUnits[P] : never;
	}[keyof FabricUnits]["name"];

	export { UnitDefinition };

	export type RoactUnitProps<TInstance extends Instance, TFabricUnitNames extends PickByInstanceRef<TInstance>> = {
		[key in TFabricUnitNames]: Required<FabricUnits[key]>["_addLayerData"] extends {}
			? Required<FabricUnits[key]>["_addLayerData"]
			: FabricUnits[key]["data"];
	};

	export { Fabric, useTags, useReplication, useRoact, useBatching, useServiceUnits };
}

export = FabricLib;
