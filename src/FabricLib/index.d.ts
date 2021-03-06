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
	export type If<C, T> = C extends true ? T : T | undefined;
	export type PropCompatible<T, TProp> = TProp extends keyof T ? true : false;

	export type ThisFabricUnit<T extends keyof FabricUnits> = Unit<T> & FabricUnits[T];

	export type PickByInstanceRef<TRef extends Instance> = {
		[P in keyof FabricUnits]: TRef extends Required<FabricUnits[P]>["ref"] ? FabricUnits[P] : never;
	}[keyof FabricUnits]["name"];

	export type InferDataType<T extends keyof FabricUnits> = Required<FabricUnits[T]>["data"] extends {}
		? Required<FabricUnits[T]>["data"]
		: Required<FabricUnits[T]>["defaults"];

	export { UnitDefinition };

	/*export type RoactUnitProps<TInstance extends Instance, TFabricUnitNames extends PickByInstanceRef<TInstance>> = {
		[key in TFabricUnitNames]: Required<FabricUnits[key]>["_addLayerData"] extends {}
			? Required<FabricUnits[key]>["_addLayerData"]
			: FabricUnits[key]["data"];
	};*/

	export { Fabric, useTags, useReplication, useRoact, useBatching, useServiceUnits };
}

export = FabricLib;
