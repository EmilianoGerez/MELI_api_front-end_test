const rp = require('request-promise');
const CustomErrorInterface = require('../utils/custom-error.interface');

exports.itemSearch = async (req, res) => {
	const { q } = req.query;
	try {
		const data = await rp(`${process.env.ML_BASE_URL}/sites/MLA/search?q=${q}`);

		try {
			const dataObj = JSON.parse(data);

			const { results, filters } = dataObj;

			// eslint-disable-next-line no-use-before-define
			const items = parseItems(results);
			const categories = parseCategories(filters);

			const response = {
				categories,
				items,
			};

			res.status(200).send(response);
		} catch (err) {
			throw new Error('Error en Json parser');
		}
	} catch (err) {
		const response = CustomErrorInterface(
			err.message || 'Error al obtener productos',
			'error',
			err
		);
		res.status(400).send(response);
	}
};

const parseItems = results => {
	const firstResults = results.slice(0, 3);

	const items = firstResults.map(result => {
		const {
			id,
			title,
			price,
			// eslint-disable-next-line camelcase
			currency_id,
			// eslint-disable-next-line camelcase
			sold_quantity,
			thumbnail,
			condition,
			// eslint-disable-next-line camelcase
			shipping: { free_shipping },
		} = result;

		const priceObj = {
			currency: currency_id,
			amount: price.split('.')[0], // FIXME: not a string
			decimals: price.split('.')[1] || 0,
		};

		return {
			id,
			title,
			price: priceObj,
			picture: thumbnail,
			condition,
			free_shipping,
			sold_quantity,
		};
	});

	return items;
};

const parseCategories = filters =>
	filters
		.map(f => {
			if (Array.isArray(f.values)) {
				return f.values;
			}
		})
		.reduce((acc, arr) => [...acc, ...arr], [])
		.filter(val => val.path_from_root)
		.map(e => e.path_from_root)
		.reduce((acc, arr) => [...acc, ...arr], [])
		.map(e => e.name);
