import { If, InferDataType, LiteralUnion, NonNullableObject, PropCompatible, ThisFabricUnit } from "..";
import Fabric from "../Fabric";

declare abstract class Unit<T extends keyof FabricUnits> {
	name: T;

	data?: InferDataType<T>;
	lastData?: Unit<T>["data"];

	fabric: Fabric;

	ref: Required<FabricUnits[T]>["ref"];

	fire(eventName: LiteralUnion<"destroy">, ...args: unknown[]): void;
	on(eventName: "destroy", callback: () => void): () => void;
	on(eventName: "loaded", callback: (newData: InferDataType<T>) => void): () => void;
	on(eventName: "updated", callback: (newData: InferDataType<T>, lastData: InferDataType<T>) => void): () => void;
	on(eventName: string, callback: (...args: unknown[]) => void): () => void;

	get(): InferDataType<T>;
	get<TKey extends keyof InferDataType<T>>(
		key: TKey,
	): Required<FabricUnits[T]>["defaults"] extends {}
		? If<PropCompatible<Required<FabricUnits[T]>["defaults"], TKey>, InferDataType<T>[TKey]>
		: never;

	//InferDataType<T>[TKey] | undefined;

	getUnit<TAdd extends keyof FabricUnits>(unitResolvable: TAdd): ThisFabricUnit<TAdd> | undefined;
	getOrCreateUnit<TAdd extends keyof FabricUnits>(unitResolvable: TAdd): ThisFabricUnit<TAdd>;

	isDestroyed(): boolean;

	addLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: Partial<InferDataType<T>>
	>(scope: unknown, data: NonNullableObject<TLayerData>): void;
	mergeBaseLayer<
		TLayerData extends Required<FabricUnits[T]>["_addLayerData"] extends {}
			? Required<FabricUnits[T]>["_addLayerData"]
			: Partial<InferDataType<T>>
	>(data: NonNullableObject<TLayerData>): void;
	removeLayer(scope: unknown): void;

	isLoaded(): boolean;
}

export = Unit;
