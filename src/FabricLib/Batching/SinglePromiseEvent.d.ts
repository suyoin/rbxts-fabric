declare class SinglePromiseEvent {
	constructor(executor: (callback: Callback) => Promise<unknown>);

	Connect(callback: Callback): { Disconnect(): void };
}
