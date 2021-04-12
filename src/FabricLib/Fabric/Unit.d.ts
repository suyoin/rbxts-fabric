import { LiteralUnion, NonNullableObject, PickByUnitRef, ThisFabricUnit } from "..";
import Fabric from "../Fabric";

declare abstract class Unit<T extends keyof FabricUnits> {
	name: T;

	data?: FabricUnits[T]["data"];
	lastData?: FabricUnits[T]["data"];

	fabric: Fabric;

	ref: Required<FabricUnits[T]>["ref"];

	fire(eventName: LiteralUnion<"destroy">, ...args: unknown[]): void;
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

	getUnit<TAdd extends PickByUnitRef<T, ThisFabricUnit<T>>>(unitResolvable: TAdd): ThisFabricUnit<TAdd> | undefined;
	getOrCreateUnit<TAdd extends PickByUnitRef<T, ThisFabricUnit<T>>>(unitResolvable: TAdd): ThisFabricUnit<TAdd>;

	isDestroyed(): boolean;

	addLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: FabricUnits[T]["data"]
	>(scope: unknown, data: NonNullableObject<TLayerData>): void;
	mergeBaseLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: FabricUnits[T]["data"]
	>(data: NonNullableObject<TLayerData>): void;
	removeLayer(scope: unknown): void;

	isLoaded(): boolean;
}

export = Unit;
