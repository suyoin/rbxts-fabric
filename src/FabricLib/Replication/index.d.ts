import { ThisFabricUnit } from "..";
import Fabric from "../Fabric";
import { UnitDefinition } from "../Fabric/Types";

interface ReplicatedDefinition extends UnitDefinition<"Replicated"> {
	ref?: ThisFabricUnit<keyof FabricUnits>;
}

interface TransmitterDefinition extends UnitDefinition<"Transmitter"> {
	ref?: ThisFabricUnit<keyof FabricUnits>;

	send(transmitEvent: string, transmitData?: unknown): void;

	sendWithPredictiveLayer(layerData: object, transmitEvent: string, transmitData?: unknown): void;

	broadcast(transmitEvent: string, transmitData: unknown): void;

	sendTo(player: Player, transmitEvent: string, transmitData: unknown): void;
}

declare global {
	interface FabricUnits {
		Replicated: ReplicatedDefinition;

		/** This unit should never be manually created.
		 * @hidden
		 */
		Transmitter: TransmitterDefinition;
	}
}

declare function useReplication<T extends Fabric>(fabric: T): void;
export = useReplication;
