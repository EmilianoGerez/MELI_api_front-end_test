const { priceFormater, getDecimals } = require('../utils/functions.util');

const itemsMapper = results => {
	const firstResults = results.slice(0, 4);

	const items = firstResults.map(result => itemMapper(result));

	return items;
};

const itemMapper = (item, description, detail = false) => {
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

	const priceInt = priceFormater(price);
	const decimals = getDecimals(price);

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
		itemFormated.description = description.plain_text;
		itemFormated.picture = pictureMapper(pictures);
	} else {
		itemFormated.state_name = item.address.state_name;
	}

	return itemFormated;
};

const pictureMapper = pictures => {
	try {
		const picture = pictures.map(p => p.url).join('-*-');
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

module.exports = { itemsMapper, itemMapper, categoriesMapper };
