const rp = require('request-promise');
const { CustomErrorInterface } = require('../utils/custom-error.interface');
const mappers = require('../utils/mappers.util');
const {
	author: { name, lastname },
} = require('../package.json');

const { itemMapper, itemsMapper, categoriesMapper } = mappers;

exports.itemSearch = async (req, res) => {
	const { q } = req.query;
	try {
		const data = await rp(`${process.env.ML_BASE_URL}/sites/MLA/search?q=${q}`);
		let dataObj;

		try {
			dataObj = JSON.parse(data);
		} catch (err) {
			throw new Error('Error en Json parser');
		}

		const { results, filters } = dataObj;

		const items = itemsMapper(results);
		const categories = categoriesMapper(filters);

		const response = {
			author: { name, lastname },
			categories,
			items,
		};

		res.status(200).send(response);
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
		// const itemData = await rp(`${process.env.ML_BASE_URL}/items/${id}`);
		// const descriptionData = await rp(
		// 	`${process.env.ML_BASE_URL}/items/${id}/description`
		// );

		const itemData = rp(`${process.env.ML_BASE_URL}/items/${id}`);
		const descriptionData = rp(
			`${process.env.ML_BASE_URL}/items/${id}/description`
		);

		const allData = {
			item: await itemData,
			desc: await descriptionData,
		};
		let itemObj;
		let descriptionObj;

		try {
			itemObj = JSON.parse(allData.item);
			descriptionObj = JSON.parse(allData.desc);
		} catch (err) {
			throw new Error('Error en Json parser');
		}
		const item = itemMapper(itemObj, descriptionObj, true);

		const response = {
			author: { name, lastname },
			item,
		};

		res.status(200).send(response);
	} catch (err) {
		const response = CustomErrorInterface(
			err.message || 'Error al obtener producto',
			'error',
			err
		);
		res.status(400).send(response);
	}
};
