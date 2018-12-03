const priceFormater = price => {
	// const priceWODecimals = Math.floor(price);

	// return priceWODecimals.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
	return Math.floor(price);
};
const getDecimals = num => {
	const floatNum = (num % 1).toFixed(2);
	const decimals = `${floatNum}`.split('.')[1];
	return parseInt(decimals, 10);
};

module.exports = {
	priceFormater,
	getDecimals,
};
