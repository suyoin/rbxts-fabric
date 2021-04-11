import Fabric from "../Fabric";
import BuiltInSerializers from "";

declare abstract class Serializer {
	readonly _serializers: LuaMetatable<{ __index }>;
	constructor(fabric: Fabric);
}
