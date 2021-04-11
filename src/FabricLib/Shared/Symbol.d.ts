import { LiteralUnion } from "FabricLib";

//This type is provided so that you can do simple predictive layers by just overriding the remote layer
/** Get the symbol of the given name. The only two that Fabric uses are `remote` and `base`. */
export function named(name: LiteralUnion<"remote" | "base">): Symbol;
