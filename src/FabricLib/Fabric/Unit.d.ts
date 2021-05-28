import { LiteralUnion, NonNullableObject, ThisFabricUnit } from "..";
import Fabric from "../Fabric";

declare abstract class Unit<T extends keyof FabricUnits> {
	name: T;

	data?: FabricUnits[T]["data"];
	lastData?: FabricUnits[T]["data"];

	fabric: Fabric;

	ref: Required<FabricUnits[T]>["ref"];

	fire(eventName: LiteralUnion<"destroy">, ...args: unknown[]): void;
	on(eventName: "destroy", callback: () => void): () => void;
	on(eventName: "loaded", callback: (newData: FabricUnits[T]["defaults"]) => void): () => void;
	on(
		eventName: "updated",
		callback: (newData: FabricUnits[T]["defaults"], lastData: FabricUnits[T]["lastData"]) => void,
	): () => void;
	on(eventName: string, callback: (...args: unknown[]) => void): () => void;

	get(): FabricUnits[T]["defaults"];
	get<TKey extends keyof Required<FabricUnits[T]>["defaults"]>(
		key: TKey,
	): Required<FabricUnits[T]>["defaults"][TKey] | undefined;

	getUnit<TAdd extends keyof FabricUnits>(unitResolvable: TAdd): ThisFabricUnit<TAdd> | undefined;
	getOrCreateUnit<TAdd extends keyof FabricUnits>(unitResolvable: TAdd): ThisFabricUnit<TAdd>;

	isDestroyed(): boolean;

	addLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: FabricUnits[T]["defaults"]
	>(scope: unknown, data: NonNullableObject<TLayerData>): void;
	mergeBaseLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: FabricUnits[T]["defaults"]
	>(data: NonNullableObject<TLayerData>): void;
	removeLayer(scope: unknown): void;

	isLoaded(): boolean;
}

export = Unit;
