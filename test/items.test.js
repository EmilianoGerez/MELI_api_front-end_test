const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

chai.use(chaiHttp);
const url = 'http://localhost:3000';
const searchTerm = 'bicicleta fixie';

// eslint-disable-next-line no-undef
describe('search items: ', () => {
	// eslint-disable-next-line no-undef
	it('should get a list of items', done => {
		chai
			.request(url)
			.get(`/api/items?q=${searchTerm}`)
			.end((err, res) => {
				const { body } = res;
				expect(res).to.have.status(200);
				// //////////////////
				// author strucutre
				expect(body)
					.to.have.property('author')
					.to.be.a('object');
				expect(body)
					.to.have.nested.property('author.name')
					.to.be.a('string');
				expect(body)
					.to.have.nested.property('author.lastname')
					.to.be.a('string');
				// ///////////////////////
				// categories strucutre
				expect(body)
					.to.have.property('categories')
					.to.be.a('array');
				// ///////////////
				// items strucutre
				expect(body)
					.to.have.property('items')
					.to.be.a('array');
				expect(body)
					.to.have.nested.property('items[0].id')
					.to.be.a('string');
				expect(body)
					.to.have.nested.property('items[0].price')
					.to.be.a('object');
				expect(body)
					.to.have.nested.property('items[0].picture')
					.to.be.a('string');
				expect(body)
					.to.have.nested.property('items[0].condition')
					.to.be.a('string');
				expect(body)
					.to.have.nested.property('items[0].free_shipping')
					.to.be.a('boolean');
				expect(body)
					.to.have.nested.property('items[0].state_name') // Creo que era necesario para la UI
					.to.be.a('string');
				// price
				expect(body)
					.to.have.nested.property('items[0].price.currency')
					.to.be.a('string');
				expect(body)
					.to.have.nested.property('items[0].price.amount')
					.to.be.a('number');
				expect(body)
					.to.have.nested.property('items[0].price.decimals')
					.to.be.a('number');

				done();
			});
	});
});
