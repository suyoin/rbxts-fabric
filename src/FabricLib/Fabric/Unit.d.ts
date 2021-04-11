import FabricLib from "..";
import Fabric from "../Fabric";

declare abstract class Unit<T extends keyof FabricUnits> {
	constructor(name: T, fabric: Fabric);

	name: T;

	data?: FabricUnits[T]["data"];
	lastData?: FabricUnits[T]["data"];

	fabric: Fabric;

	ref: Required<FabricUnits[T]>["ref"];

	fire(eventName: FabricLib.LiteralUnion<"destroy">, ...args: unknown[]): void;

	fire(eventName: FabricLib.LiteralUnion<"destroy">, ...args: never[]): void;
	on(eventName: "destroy", callback: () => void): () => void;
	on(eventName: "loaded", callback: (newData: FabricUnits[T]["data"]) => void): () => void;
	on(
		eventName: "updated",
		callback: (newData: FabricUnits[T]["data"], lastData: FabricUnits[T]["data"]) => void,
	): () => void;
	on(eventName: string, callback: (...args: unknown[]) => void): () => void;

	get(): FabricUnits[T]["data"];
	get<TKey extends keyof Required<FabricUnits[T]>["data"]>(
		key: TKey,
	): Required<FabricUnits[T]>["data"][TKey] | undefined;

	getUnit<TAdd extends keyof FabricUnits>(unitResolvable: TAdd): FabricLib.ThisFabricUnit<TAdd> | undefined;

	getOrCreateUnit<TAdd extends keyof FabricUnits>(unitResolvable: TAdd): FabricLib.ThisFabricUnit<TAdd>;

	isDestroyed(): boolean;

	addLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: Partial<FabricUnits[T]["data"]>
	>(scope: unknown, data: FabricLib.NonNullableObject<TLayerData>): void;
	mergeBaseLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: Partial<FabricUnits[T]["data"]>
	>(data: FabricLib.NonNullableObject<TLayerData>): void;
	removeLayer(scope: unknown): void;

	isLoaded(): boolean;
}

export = Unit;
