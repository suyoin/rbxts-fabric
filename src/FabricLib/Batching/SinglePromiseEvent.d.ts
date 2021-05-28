declare class SinglePromiseEvent {
	constructor(
		executor: (
			callback: Callback,
		) => (...[resolve, reject, onCancel]: Parameters<Parameters<PromiseConstructor["defer"]>[0]>) => unknown,
	);

	Connect(callback: Callback): { Disconnect(): void };
}

export = SinglePromiseEvent;
