import FabricLib from "..";
import { UnitDefinition } from "./Types";

declare class Fabric {
	protected DEBUG: boolean;
	readonly namespace: string;
	protected readonly _listeners: {};

	readonly serializer: 1;
	constructor(namespace?: string | "game");

	registerUnit<T extends keyof FabricUnits>(unitDefinition: UnitDefinition<T>): UnitDefinition<T>;
	registerUnitsIn(container: Instance): void;
	getUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"],
	): FabricLib.ThisFabricUnit<T> | undefined;
	getOrCreateUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"],
	): FabricLib.ThisFabricUnit<T>;
	getLoadedUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"],
	): Promise<FabricLib.ThisFabricUnit<T> | undefined>;
	removeAllUnitsWithRef(ref: unknown): void;

	fire(eventName: string, ...args: never[]): void;
	on(
		eventName: "unitHotReloaded" | "unitRegistered",
		callback: <T extends keyof FabricUnits>(unitDefinition: UnitDefinition<T>) => void,
	): () => void;

	debug(...args: never[]): void;
}

export = Fabric;
