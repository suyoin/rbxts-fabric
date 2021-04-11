import SinglePromiseEvent from "FabricLib/Batching/SinglePromiseEvent";
import { PickByRef, ThisFabricUnit } from "..";
import Unit from "./Unit";

interface BatchListenerDefinition {
	event: SinglePromiseEvent;
	callback: () => void;
}

interface BatchConstructors<T extends keyof FabricUnits> {
	event: (
		event: { Connect(...args: never[]): unknown },
		callback: (units: ThisFabricUnit<T>[]) => void,
	) => BatchListenerDefinition;

	interval: (duration: number, callback: (units: ThisFabricUnit<T>[]) => void) => BatchListenerDefinition;

	spreadInterval: (
		duration: number,
		callbackCreator: () => (unit: ThisFabricUnit<T>) => void,
	) => BatchListenerDefinition;
}

interface UnitDefinition<T extends keyof FabricUnits> {
	name: T;
	tag?: string;

	/** @hidden */
	data?: unknown;
	/** @hidden */
	_addLayerData?: unknown;
	/** @hidden */
	ref?: unknown;

	reducer?: (values: unknown[]) => Unit<T>["data"];
	schema?: (value: unknown) => boolean;
	refCheck?: string[] | ((ref: unknown) => boolean);

	defaults?: { [index: string]: unknown };

	units?: {
		[key in PickByRef<ThisFabricUnit<T>>]?: Required<FabricUnits[key]>["_addLayerData"] extends {}
			? Required<FabricUnits[key]>["_addLayerData"]
			: Partial<FabricUnits[key]["data"]>;
	};

	effects?:
		| Map<unknown, undefined | ((unit: ThisFabricUnit<T>) => (() => void) | void)>
		| Array<(this: ThisFabricUnit<T>) => (() => void) | void>;

	shouldUpdate?: (newData: Unit<T>["data"], lastData: Unit<T>["data"]) => boolean;

	onLoaded?(this: ThisFabricUnit<T>, newData: Unit<T>["data"]): void;
	onUpdated?(this: ThisFabricUnit<T>, newData: Unit<T>["data"], lastData: Unit<T>["data"]): void;
	onInitialize?(this: ThisFabricUnit<T>): void;
	onHotReloaded?(this: ThisFabricUnit<T>): void;
	onDestroy?(this: ThisFabricUnit<T>): void;
	render?(
		this: ThisFabricUnit<T>,
		createElement: (instance: Instance, props: unknown, children: object) => object,
	): void;
	batch?: true | ((on: BatchConstructors<T>) => BatchListenerDefinition[]);
}
