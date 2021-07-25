const chai = require("chai");
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');

const assert = chai.assert;

dotenv.config();
chai.use(chaiHttp);

const url = process.env.URL;
const token = process.env.ACCESS_TOKEN; 
describe("As a customer, I want to see ALL kind of Orders", () => {  

    it("It should give ERROR message, because there is NO token", (done) => {
        chai
            .request(url)
            .get('/orders')
            .then((response) => {
                assert.equal(response.status, 401);
                assert.equal(response.body.error, "Missing Authorization header.");
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should SUCCESS to load all of the orders", (done) => {
        chai
            .request(url)
            .get('/orders')
            .set("Authorization", "Bearer " + token)
            .then((response) => {
                assert.equal(response.status, 200);

                assert.containsAllKeys(response.body[0], ["id", "bookId", "customerName", "createdBy", "quantity"]);
                assert.isString(response.body[0].id);
                assert.isNumber(response.body[0].bookId);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should SUCCESS to load SINGLE of the order", (done) => {
        chai.request(url)
            .get("/orders")
            .set("Authorization", "Bearer " + token)
            .then((response) => {
                assert.equal(response.status, 200);
                const orderId = response.body[0].id;

                chai.request(url)
                    .get(`/orders/${orderId}`)
                    .set("Authorization", "Bearer " + token)
                    .then((response) => {
                        assert.equal(response.status, 200);
                        assert.equal(response.body.id, orderId);
                        done();
                    });
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should give ERROR Message, because INVALID Order ID is given", (done) => {
        chai.request(url)
            .get("/orders")
            .set("Authorization", "Bearer " + token)
            .then((response) => {
                assert.equal(response.status, 200);
                const invalidOrderId = "invalidOrderId";

                chai.request(url)
                    .get(`/orders/${invalidOrderId}`)
                    .set("Authorization", "Bearer " + token)
                    .then((response) => {
                        assert.equal(response.status, 404)
                        assert.equal(response.body.error, `No order with id ${invalidOrderId}.`);
                        done();
                    });
            })
            .catch((error) => {
                done(error);
            });
    });

});