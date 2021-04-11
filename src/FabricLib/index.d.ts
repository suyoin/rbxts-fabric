import Fabric from "./Fabric";
import useTags from "./Tags";
import useReplication from "./Replication";
import useRoact from "./Roact";
import useBatching from "./Batching";
import useServiceUnits from "./ServiceUnits";
import Unit from "./Fabric/Unit";

import * as Symbol from "./Shared/Symbol";
import * as Reducers from "./Fabric/Operators/Reducers";

declare global {
	interface FabricUnits {}
}

declare namespace FabricLib {
	export { Fabric, useTags, useReplication, useRoact, useBatching, useServiceUnits };
}

declare namespace FabricLib {
	export type LiteralUnion<T extends string> = T | (Pick<string, never> & { _?: never });
	export type NonNullableObject<T extends object> = {
		[K in keyof T]: T[K] extends undefined ? never : T[K];
	};
	export type ThisFabricUnit<T extends keyof FabricUnits> = Unit<T> & FabricUnits[T];
	export type PickByRef<TRef> = {
		[P in keyof FabricUnits]: Required<FabricUnits[P]>["ref"] extends TRef ? FabricUnits[P] : never;
	}[keyof FabricUnits]["name"];
}

export = FabricLib;
