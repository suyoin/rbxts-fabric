import Unit from "../../FabricLib/Fabric/Unit";

declare class ServerTransmitter {
	static Remote: {
		subscribe: (ServerTransmitter: ServerTransmitter, player: Player, transmitter: Unit<"Transmitter">) => void;
		unsubscribe: (ServerTransmitter: ServerTransmitter, player: Player, transmitter: Unit<"Transmitter">) => void;
	};
}

export = ServerTransmitter;
