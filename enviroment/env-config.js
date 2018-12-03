require('dotenv').config();

const env = process.env.NODE_ENV;

const dev = {
	app: {
		port: 3000,
	},
	db: {},
};
const prod = {
	app: {
		port: 3000,
	},
	db: {},
};

const config = {
	dev,
	prod,
};

module.exports = config[env];
