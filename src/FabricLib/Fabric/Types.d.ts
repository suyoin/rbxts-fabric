import SinglePromiseEvent from "../../FabricLib/Batching/SinglePromiseEvent";
import { ThisFabricUnit } from "..";
import Unit from "./Unit";
import Roact from "@rbxts/roact";

interface BatchListenerDefinition {
	event: SinglePromiseEvent;
	callback: Callback;
}

type MapBindings<T> = { [K in keyof T]: T[K] | Roact.Binding<T[K]> };
type HostComponentProps<T extends Roact.HostComponent> = Partial<WritableInstanceProperties<CreatableInstances[T]>> & {
	[Roact.Ref]?: Roact.Ref<CreatableInstances[T]> | ((ref: CreatableInstances[T])=> void) 
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
		[key in keyof FabricUnits]?: Required<FabricUnits[key]>["_addLayerData"] extends {}
			? Required<FabricUnits[key]>["_addLayerData"]
			: FabricUnits[key]["data"];
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
	render?<E extends Roact.HostComponent>(
		this: ThisFabricUnit<T>,
		createElement: (instance: E, props?: MapBindings<HostComponentProps<E>>, children?: 
		| { [childName: string]: Roact.Element }
		| ReadonlyMap<string | number, Roact.Element>
		| ReadonlyArray<Roact.Element>,
			) => Roact.Element,
	): void;
	batch?: true | ((on: BatchConstructors<T>) => BatchListenerDefinition[]);
}
