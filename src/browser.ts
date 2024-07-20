// biome-ignore lint/complexity/useArrowFunction: <explanation>
const getGlobal = function () {
	if (typeof globalThis !== "undefined") {
		return globalThis;
	}
	if (typeof global !== "undefined") {
		return global;
	}
	if (typeof window !== "undefined") {
		return window;
	}
	if (typeof self !== "undefined") {
		return self;
	}
	throw new Error("unable to locate global object");
};

const globalObject = getGlobal();

export const fetch = globalObject.fetch;

export default globalObject.fetch.bind(globalObject);
