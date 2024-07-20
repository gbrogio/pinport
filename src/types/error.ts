export type ThrowErrorResponse = {
	error:
		| "unknown"
		| {
				issues: (
					| {
							code: "invalid_type";
							expected: string;
							received: string;
							path: [number, ...string[]];
							message: string;
					  }
					| {
							code: "too_small";
							message: string;
							minimum: number;
							path: [];
					  }
				)[];
		  };
};
