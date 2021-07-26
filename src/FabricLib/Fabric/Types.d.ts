import SinglePromiseEvent from "../../FabricLib/Batching/SinglePromiseEvent";
import { InferDataType, ThisFabricUnit } from "..";
import Roact from "@rbxts/roact";

interface BatchListenerDefinition {
	event: SinglePromiseEvent;
	callback: Callback;
}

type MapBindings<T> = { [K in keyof T]: T[K] | Roact.Binding<T[K]> };
type HostComponentProps<T extends Roact.HostComponent> = Partial<WritableInstanceProperties<CreatableInstances[T]>> & {
	[Roact.Ref]?: Roact.Ref<CreatableInstances[T]> | ((ref: CreatableInstances[T]) => void);
};

interface BatchConstructors<T extends keyof FabricUnits> {
	event: (
		event: { Connect(...args: never[]): unknown },
		callback: (units: ThisFabricUnit<T>[]) => void,
	) => BatchListenerDefinition;

	interval: (duration: number, callback: (unit: ThisFabricUnit<T>) => void) => BatchListenerDefinition;

	spreadInterval: (
		duration: number,
		callbackCreator: () => (unit: ThisFabricUnit<T>) => void,
	) => BatchListenerDefinition;
}

type RoactUnitProps = {
	[unitDefinition in UnitDefinition<keyof FabricUnits> as symbol]: InferDataType<unitDefinition["name"]>;
};

type RoactComponentChildren =
	| { [childName: string]: Roact.Element }
	| ReadonlyMap<string | number, Roact.Element>
	| ReadonlyArray<Roact.Element>;

interface UnitDefinition<T extends keyof FabricUnits> {
	name: T;
	tag?: string;

	/** @hidden */
	data?: unknown;
	/** @hidden */
	_addLayerData?: unknown;
	/** @hidden */
	ref?: unknown;

	reducer?: (values: unknown[]) => InferDataType<T>;
	schema?: (value: unknown) => boolean;
	refCheck?: string[] | ((ref: unknown) => boolean);

	defaults?: FabricUnits[T]["data"] extends {} | unknown ? Partial<FabricUnits[T]["data"]> : never;

	units?: {
		[key in keyof FabricUnits]?: Required<FabricUnits[key]>["_addLayerData"] extends {}
			? Required<FabricUnits[key]>["_addLayerData"]
			: InferDataType<key>;
	};

	effects?:
		| Map<unknown, undefined | ((unit: ThisFabricUnit<T>) => (() => void) | void)>
		| Array<(this: ThisFabricUnit<T>) => (() => void) | void>;

	shouldUpdate?: (newData: InferDataType<T>, lastData: InferDataType<T>) => boolean;

	onLoaded?(this: ThisFabricUnit<T>, newData: InferDataType<T>): void;
	onUpdated?(this: ThisFabricUnit<T>, newData: InferDataType<T>, lastData: InferDataType<T>): void;
	onInitialize?(this: ThisFabricUnit<T>): void;
	onHotReloaded?(this: ThisFabricUnit<T>): void;
	onDestroy?(this: ThisFabricUnit<T>): void;
	render?: Required<FabricUnits[T]>["ref"] extends Instance
		? (
				this: ThisFabricUnit<T>,
				createElement: (<P>(
					instance: Roact.FunctionComponent<P>,
					props?: MapBindings<P> & RoactUnitProps,
					children?: RoactComponentChildren,
				) => Roact.Element) &
					(<P>(
						instance: Roact.ComponentConstructor<P>,
						props?: MapBindings<P> & RoactUnitProps,
						children?: RoactComponentChildren,
					) => Roact.Element) &
					(<C extends Roact.HostComponent>(
						instance: C,
						props?: MapBindings<HostComponentProps<C>> & RoactUnitProps,
						children?: RoactComponentChildren,
					) => Roact.Element),
		  ) => Roact.Element
		: never;

	batch?: true | ((on: BatchConstructors<T>) => BatchListenerDefinition[]);
}
