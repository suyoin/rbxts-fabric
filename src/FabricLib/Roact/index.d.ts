import Fabric from "../Fabric";

declare type useRoact = (fabric: Fabric, roact: typeof import("@rbxts/roact")) => void;

export = useRoact;
