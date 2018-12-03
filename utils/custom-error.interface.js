const CustomErrorInterface = (message, type, err) => {
	const { name, stack } = err;
	return {
		message,
		type,
		name,
		stack,
	};
};

module.exports = { CustomErrorInterface };
