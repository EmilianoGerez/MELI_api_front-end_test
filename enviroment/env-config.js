require('dotenv').config();

const env = process.env.NODE_ENV;

const dev = {
	app: {
		port: 3000,
	},
	db: {
		host: 'localhost',
		port: 27017,
		name: 'api_meli_dev',
	},
};
const prod = {
	app: {
		port: 3001,
	},
	db: {
		host: 'localhost',
		port: 27017,
		name: 'api_meli_prod',
	},
};

const config = {
	dev,
	prod,
};

module.exports = config[env];
