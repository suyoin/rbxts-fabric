export function last(values: unknown[]): any;
export function first(values: unknown[]): any;
export function truthy(values: unknown[]): any;
export function falsy(values: unknown[]): any;
export function add(values: unknown[]): any;
export function multiply(values: unknown[]): any;
export function concatArray(values: unknown[]): any;
export function collect(values: unknown[]): any;
export function lowest(values: unknown[]): any;
export function highest(values: unknown[]): any;
export function mergeTable(values: unknown[]): any;
export function concatString(delimiter: string): (values: unknown[]) => any;
export function priorityValue(reducer: () => any): (values: unknown[]) => any;
export function structure(
	reducers?: { [key in string | number]: (values: unknown[]) => unknown },
	defaultReducer?: (values: unknown[]) => unknown
): (values: unknown[]) => any;
export function map(
	reducer: (values: unknown[]) => unknown
): (values: unknown[]) => any;
export function exactly<T>(value: T): () => T;
//Reducers.try can't be done because it is a keyword
export function compose<T extends (values: unknown[]) => unknown>(
	reducers: T[]
): (values: unknown[]) => any;

export function thisOr(
	reducer: (values: unknown[]) => unknown,
	defaultValue: any
): (values: unknown[]) => any;
