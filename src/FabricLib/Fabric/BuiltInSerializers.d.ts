import Fabric from "../Fabric";
import Unit from "./Unit";

type FailMode = () => LuaMetatable<[]>;

interface BuiltInSerializers {
	serializers: {
		[Unit]: <U extends string, F extends Fabric>(
			unit: U,
			fabric: F,
		) => { type: "_unit"; name: U; ref: (object: object) => () => {} | void };
	};

	deserializer: {
		_unit: (data: object, fabric: Fabric, failMode: FailMode) => {};
	};
}

export = BuiltInSerializers;
