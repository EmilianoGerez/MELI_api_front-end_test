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
			const items = itemsMapper(results);
			// eslint-disable-next-line no-use-before-define
			const categories = categoriesMapper(filters);

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

exports.getItem = async (req, res) => {
	const { id } = req.params;
	try {
		const itemData = await rp(`${process.env.ML_BASE_URL}/items/${id}`);
		const descriptionData = await rp(
			`${process.env.ML_BASE_URL}/items/${id}/description`
		);

		try {
			const dataObj = JSON.parse(itemData);

			// eslint-disable-next-line no-use-before-define
			const items = itemMapper(dataObj, true);

			res.status(200).send(items);
		} catch (err) {
			throw new Error('Error en Json parser');
		}
	} catch (err) {
		const response = CustomErrorInterface(
			err.message || 'Error al obtener producto',
			'error',
			err
		);
		res.status(400).send(response);
	}
};

const itemsMapper = results => {
	const firstResults = results.slice(0, 4);

	const items = firstResults.map(result => {
		// const {
		// 	id,
		// 	title,
		// 	price,
		// 	// eslint-disable-next-line camelcase
		// 	currency_id,
		// 	// eslint-disable-next-line camelcase
		// 	sold_quantity,
		// 	thumbnail,
		// 	condition,
		// 	// eslint-disable-next-line camelcase
		// 	shipping: { free_shipping },
		// } = result;

		// const priceInt = Math.floor(price);
		// const decimals = (price % 1).toFixed(2);

		// const priceObj = {
		// 	currency: currency_id,
		// 	amount: priceInt,
		// 	decimals,
		// };

		// return {
		// 	id,
		// 	title,
		// 	price: priceObj,
		// 	picture: thumbnail,
		// 	condition,
		// 	free_shipping,
		// 	sold_quantity,
		// };
		return itemMapper(result);
	});

	return items;
};

const itemMapper = (item, detail = false) => {
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
		pictures,
	} = item;

	const priceInt = Math.floor(price);
	const decimals = (price % 1).toFixed(2);

	const priceObj = {
		currency: currency_id,
		amount: priceInt,
		decimals,
	};

	const itemFormated = {
		id,
		title,
		price: priceObj,
		picture: thumbnail,
		condition,
		free_shipping,
	};

	if (detail) {
		// eslint-disable-next-line camelcase
		itemFormated.sold_quantity = sold_quantity;
		itemFormated.description = ''; // FIXME: get description
		itemFormated.picture = pictureMapper(pictures);
	}

	return itemFormated;
};

const pictureMapper = pictures => {
	try {
		const picture = pictures.map(p => p.url).join('--');
		return picture;
	} catch (e) {
		return '';
	}
};

const categoriesMapper = filters =>
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
