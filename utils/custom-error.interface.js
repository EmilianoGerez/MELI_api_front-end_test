// class CustomError extends Error {
// 	constructor(message, type) {
// 		super();
// 		Error.captureStackTrace(this, this.constructor);
// 		this.name = 'CustomError';
// 		this.message = message;
// 		this.type = type;
// 	}
// }

const CustomErrorInterface = (message, type, err) => {
	const { name, stack } = err;
	return {
		message,
		type,
		name,
		stack,
	};
};

module.exports.CustomErrorInterface = CustomErrorInterface;
