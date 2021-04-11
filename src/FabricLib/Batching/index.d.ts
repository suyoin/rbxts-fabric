import Fabric from "../Fabric";

declare function useBatching<T extends Fabric>(fabric: T): void;

export = useBatching;
