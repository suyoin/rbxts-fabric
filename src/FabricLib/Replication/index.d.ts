import FabricLib from "..";
import Fabric from "../Fabric";
import { UnitDefinition } from "../Fabric/Types";

interface ReplicatedDefinition extends UnitDefinition<"Replicated"> {
	ref: FabricLib.ThisFabricUnit<keyof FabricUnits>;
}

declare global {
	interface FabricUnits {
		Replicated: ReplicatedDefinition;
	}
}
declare function useReplication<T extends Fabric>(fabric: T): void;

export = useReplication;
