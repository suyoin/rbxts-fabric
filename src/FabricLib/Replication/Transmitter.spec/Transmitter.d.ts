import FabricLib from "../..";
import { UnitDefinition } from "../../Fabric/Types";

/** This unit should never be manually created. */
interface TransmitterDefinition extends UnitDefinition<"Transmitter"> {
	ref: FabricLib.ThisFabricUnit<keyof FabricUnits>;

	send(transmitEvent: string, transmitData?: unknown): void;

	sendWithPredictiveLayer(layerData: object, transmitEvent: string, transmitData?: unknown): void;

	broadcast(transmitEvent: string, transmitData: unknown): void;

	sendTo(player: Player, transmitEvent: string, transmitData: unknown): void;
}

declare global {
	interface FabricUnits {
		/** This unit should never be manually created.
		 * @hidden
		 */
		Transmitter: TransmitterDefinition;
	}
}
