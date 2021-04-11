import { LiteralUnion, ThisFabricUnit } from "..";
import { UnitDefinition } from "./Types";

declare class Fabric {
	protected DEBUG: boolean;
	readonly namespace: string;

	/** The `None` symbol is used when trying to make a field nil in `mergeBaseLayer`. */
	readonly None: never;

	constructor(namespace?: LiteralUnion<"game">);

	registerUnit<T extends keyof FabricUnits>(unitDefinition: UnitDefinition<T>): UnitDefinition<T>;
	registerUnitsIn(container: Instance): void;
	getUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"],
	): ThisFabricUnit<T> | undefined;
	getOrCreateUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"],
	): ThisFabricUnit<T>;
	getLoadedUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"],
	): Promise<ThisFabricUnit<T> | undefined>;
	removeAllUnitsWithRef(ref: unknown): void;

	fire(eventName: string, ...args: never[]): void;
	on(
		eventName: "unitHotReloaded" | "unitRegistered",
		callback: <T extends keyof FabricUnits>(unitDefinition: UnitDefinition<T>) => void,
	): () => void;

	debug(...args: never[]): void;
}

export = Fabric;
