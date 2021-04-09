interface ReplicatedDefinition extends UnitDefinition<"Replicated"> {
	ref: ThisFabricUnit<keyof FabricUnits>;
}

interface TransmitterDefinition extends UnitDefinition<"Transmitter"> {
	ref: ThisFabricUnit<keyof FabricUnits>;
	/**
	 * @param {string} transmitEvent - The base name of the server event function to call
	 * @param {unknown} transmitData - [optional] Data to give to the transmitEvent function
	 * @client
	 */
	send(transmitEvent: string, transmitData?: unknown): void;

	/**
	 * @param {object} layerData - The layer data to apply to the unit before the server responds with the prediction status
	 * @param {string} transmitEvent - The base name of the server event function to call
	 * @param {unknown} transmitData - [optional] Data to give to the transmitEvent function
	 * @client
	 */
	sendWithPredictiveLayer(
		layerData: object,
		transmitEvent: string,
		transmitData?: unknown
	): void;

	/** Broadcast the transmission to all subscribers
	 * @param {string} transmitEvent - The base name of the server event function to call
	 * @param {unknown} transmitData - [optional] Data to give to the transmitEvent function
	 * @server
	 */
	broadcast(transmitEvent: string, transmitData: unknown): void;

	/** Broadcast the transmission to the given player
	 * @param {Player} player - The player to send the transmission to
	 * @param {string} transmitEvent - The base name of the server event function to call
	 * @param {unknown} transmitData - [optional] Data to give to the transmitEvent function
	 * @server
	 */
	sendTo(player: Player, transmitEvent: string, transmitData: unknown): void;
}

declare global {
	interface FabricUnits {
		Replicated: ReplicatedDefinition;
		Transmitter: TransmitterDefinition;
	}
}

//This has to be used because abstract class types cannot extend from each other
/** The type that represents the `this` variable for a unit */
export type ThisFabricUnit<T extends keyof FabricUnits> = FabricUnit<T> &
	FabricUnits[T];

type LiteralUnion<T extends string> = T | (Pick<string, never> & { _?: never });
type NonNullableObject<T extends {}> = {
	[key in keyof T]: T[key] extends undefined ? never : T[key];
};
type PublicObject<T extends {}> = {
	[key in keyof T]: T[key];
};

type DisconnectFunction = () => void;

declare class SinglePromiseEvent {
	Connect(callback: (...args: unknown[]) => void): { Disconnect(): void };
}

interface BatchListenerDefinition {
	event: SinglePromiseEvent;
	callback: () => void;
}

interface BatchConstructors<T extends keyof FabricUnits> {
	/** For batch updates on a custom event */
	event: (
		event: { Connect(...args: never[]): unknown },
		callback: (units: ThisFabricUnit<T>[]) => void
	) => BatchListenerDefinition;

	/** Interval updates */
	interval: (
		duration: number,
		callback: (units: ThisFabricUnit<T>[]) => void
	) => BatchListenerDefinition;

	/** Interval, but evenly spread out updates over a period of time to reduce lag */
	spreadInterval: (
		duration: number,
		callbackCreator: () => (unit: ThisFabricUnit<T>) => void
	) => BatchListenerDefinition;

	/** Interval but on a simple Heartbeat connection */
	heartbeatInterval: (
		callback: (units: ThisFabricUnit<T>[]) => void
	) => BatchListenerDefinition;
}

export interface UnitDefinition<T extends keyof FabricUnits> {
	name: T;
	tag?: string;

	/** @hidden */
	data?: unknown;
	/** @hidden */
	_addLayerData?: unknown;
	/** @hidden */
	ref?: unknown;

	reducer?: (values: unknown[]) => FabricUnit<T>["data"];
	schema?: (value: unknown) => boolean;
	refCheck?: string[] | ((ref: unknown) => boolean);

	defaults?: Map<string, unknown>;
	//todo if _addLayerData exists, make this accept that. Not sure how to do conditionals here
	units?: { [key in keyof FabricUnits]?: FabricUnit<T>["data"] };
	effects?:
		| Map<
				unknown,
				undefined | ((unit: ThisFabricUnit<T>) => (() => void) | void)
		  >
		| Array<undefined | ((unit: ThisFabricUnit<T>) => (() => void) | void)>;

	shouldUpdate?: (
		newData: FabricUnit<T>["data"],
		lastData: FabricUnit<T>["data"]
	) => boolean;

	onLoaded?(this: ThisFabricUnit<T>, newData: FabricUnit<T>["data"]): void;
	onUpdated?(
		this: ThisFabricUnit<T>,
		newData: FabricUnit<T>["data"],
		lastData: FabricUnit<T>["data"]
	): void;
	onInitialize?(this: ThisFabricUnit<T>): void;
	onHotReloaded?(this: ThisFabricUnit<T>): void;
	onDestroy?(this: ThisFabricUnit<T>): void;
	render?(
		this: ThisFabricUnit<T>,
		createElement: (
			instance: Instance,
			props: unknown,
			children: object
		) => import("@rbxts/roact").Element
	): void;
	batch?: true | ((on: BatchConstructors<T>) => BatchListenerDefinition[]);
}

declare abstract class FabricUnit<TName extends keyof FabricUnits>
	implements UnitDefinition<TName> {
	name: TName;

	data?: Partial<FabricUnits[TName]["data"]>;
	lastData?: Partial<FabricUnits[TName]["data"]>;

	fabric: Fabric;

	fire(eventName: LiteralUnion<"destroy">, ...args: never[]): void;
	on(eventName: "destroy", callback: () => void): DisconnectFunction;
	on(
		eventName: "loaded",
		callback: (newData: FabricUnits[TName]["data"]) => void
	): DisconnectFunction;
	on(
		eventName: "updated",
		callback: (
			newData: FabricUnits[TName]["data"],
			lastData: FabricUnits[TName]["data"]
		) => void
	): DisconnectFunction;
	on(
		eventName: string,
		callback: (...args: unknown[]) => void
	): DisconnectFunction;

	ref: Required<FabricUnits[TName]>["ref"];

	/** Purely returns a unit's data. If called from an effect or UnitDefinition:render(), it will bind to changes to that piece of data */
	get(): FabricUnits[TName]["data"];
	/** Gets a key from a unit's data. If called from an effect or UnitDefinition:render(), it will bind to changes to that piece of data */
	get<TKey extends keyof Required<FabricUnit<TName>>["data"]>(
		key: TKey
	): Partial<Required<FabricUnit<TName>>["data"]>[TKey];
	getUnit<TAdd extends keyof FabricUnits>(
		unitResolvable: TAdd
	): ThisFabricUnit<TAdd> | undefined;
	//todo figure out how to make this check the ref
	/** CAUTION: This does not check the ref typings! */
	getOrCreateUnit<TAdd extends keyof FabricUnits>(
		unitResolvable: TAdd
	): ThisFabricUnit<TAdd>;

	isDestroyed(): boolean;

	addLayer<
		TLayerData extends Required<FabricUnits[TName]>["_addLayerData"] extends {}
			? Required<FabricUnits[TName]>["_addLayerData"]
			: Partial<FabricUnits[TName]["data"]>
	>(scope: unknown, data: NonNullableObject<TLayerData>): void;
	mergeBaseLayer<
		TLayerData extends Required<FabricUnits[TName]>["_addLayerData"] extends {}
			? Required<FabricUnits[TName]>["_addLayerData"]
			: Partial<FabricUnits[TName]["data"]>
	>(data: NonNullableObject<TLayerData>): void;
	removeLayer(scope: unknown): void;

	isLoaded(): boolean;
}

export declare class Fabric {
	namespace: string;

	None: Symbol;

	constructor(namespace: string);

	registerUnit<T extends keyof FabricUnits>(
		unitDefinition: UnitDefinition<T>
	): UnitDefinition<T>;
	registerUnitsIn(container: Instance): void;
	getUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"]
	): ThisFabricUnit<T> | undefined;
	getOrCreateUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"]
	): ThisFabricUnit<T>;
	getLoadedUnitByRef<T extends keyof FabricUnits>(
		unitResolvable: T,
		ref: Required<FabricUnits[T]>["ref"]
	): Promise<ThisFabricUnit<T> | undefined>;
	removeAllUnitsWithRef(ref: unknown): void;

	fire(eventName: string, ...args: never[]): void;
	on(
		eventName: "unitHotReloaded" | "unitRegistered",
		callback: <T extends keyof FabricUnits>(
			unitDefinition: UnitDefinition<T>
		) => void
	): DisconnectFunction;

	debug(...args: never[]): void;
}

export function useTags(fabric: Fabric): void;
export function useReplication(fabric: Fabric): void;
export function useRoact(
	fabric: Fabric,
	roact: typeof import("@rbxts/roact")
): void;
export function useServiceUnits(fabric: Fabric): void;
export function useBatching(fabric: Fabric): void;
