import FabricLib from "..";
import Unit from "./Unit";

interface BatchListenerDefinition {
	event: SinglePromiseEvent;
	callback: () => void;
}

interface BatchConstructors<T extends keyof FabricUnits> {
	event: (
		event: { Connect(...args: never[]): unknown },
		callback: (units: FabricLib.ThisFabricUnit<T>[]) => void,
	) => BatchListenerDefinition;

	interval: (duration: number, callback: (units: FabricLib.ThisFabricUnit<T>[]) => void) => BatchListenerDefinition;

	spreadInterval: (
		duration: number,
		callbackCreator: () => (unit: FabricLib.ThisFabricUnit<T>) => void,
	) => BatchListenerDefinition;

	heartbeatInterval: (callback: (units: FabricLib.ThisFabricUnit<T>[]) => void) => BatchListenerDefinition;
}

interface UnitDefinition<T extends keyof FabricUnits> {
	name: T;
	tag?: string;

	data?: unknown;

	_addLayerData?: unknown;

	ref?: unknown;

	reducer?: (values: unknown[]) => Unit<T>["data"];
	schema?: (value: unknown) => boolean;
	refCheck?: string[] | ((ref: unknown) => boolean);

	defaults?: { [index: string]: unknown };

	units?: { [key in keyof FabricUnits]?: Unit<key>["data"] };

	effects?:
		| Map<unknown, undefined | ((unit: FabricLib.ThisFabricUnit<T>) => (() => void) | void)>
		| Array<(this: FabricLib.ThisFabricUnit<T>) => (() => void) | void>;

	shouldUpdate?: (newData: Unit<T>["data"], lastData: Unit<T>["data"]) => boolean;

	onLoaded?(this: FabricLib.ThisFabricUnit<T>, newData: Unit<T>["data"]): void;
	onUpdated?(this: FabricLib.ThisFabricUnit<T>, newData: Unit<T>["data"], lastData: Unit<T>["data"]): void;
	onInitialize?(this: FabricLib.ThisFabricUnit<T>): void;
	onHotReloaded?(this: FabricLib.ThisFabricUnit<T>): void;
	onDestroy?(this: FabricLib.ThisFabricUnit<T>): void;
	render?(
		this: FabricLib.ThisFabricUnit<T>,
		createElement: (instance: Instance, props: unknown, children: object) => object,
	): void;
	batch: true | ((on: BatchConstructors<T>) => BatchListenerDefinition[]);
}
