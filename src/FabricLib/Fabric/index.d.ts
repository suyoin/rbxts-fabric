/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LiteralUnion, ThisFabricUnit } from "..";
import { UnitDefinition } from "./Types";
import Unit from "./Unit";

declare class UnitCollection {
	/** @hidden */
	_unitsByName: { [key in keyof FabricUnits]: FabricUnits[key] };
	//this is only exposed to fix Fabric#55 and using Unit<keyof FabricUnits> results in a circular reference, so that is why these are <"Transmitter">
	/** @hidden */
	_refUnits: Map<unknown, Map<UnitDefinition<"Transmitter">, Unit<"Transmitter">>>;

	resolve<TUnitName extends string>(
		unitResolvable:
			| TUnitName
			| ({ name: TUnitName } & (TUnitName extends keyof FabricUnits ? UnitDefinition<TUnitName> : object)),
	): TUnitName extends keyof FabricUnits ? UnitDefinition<TUnitName> : object | undefined;
}

declare class Fabric {
	public DEBUG: boolean;
	readonly namespace: string;

	/** The `None` symbol is used when trying to make a field nil in `mergeBaseLayer`. */
	readonly None: never;

	constructor(namespace?: LiteralUnion<"game">);

	_collection: UnitCollection;

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
