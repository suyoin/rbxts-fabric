import Fabric from "../Fabric";

/** Units that are registered with `isService = true` are automatically created with a `ref` of `game`. */
declare function useServiceUnits(fabric: Fabric): void;
export = useServiceUnits;
