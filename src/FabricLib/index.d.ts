import Fabric from "./Fabric";
import useTags from "./Tags";
import useReplication from "./Replication";
import useRoact from "./Roact";
import useBatching from "./Batching";
import useServiceUnits from "./ServiceUnits";
import Unit from "./Fabric/Unit";

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
}

export = FabricLib;
