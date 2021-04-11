import Fabric from "../Fabric";
type Roact = 2;

declare type useRoact<T extends Fabric, U extends Roact> = (fabric: T, roact: U) => void;

export = useRoact;
