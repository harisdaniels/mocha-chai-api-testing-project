const chai = require("chai");
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');

const assert = chai.assert;

dotenv.config();
chai.use(chaiHttp);

const url = process.env.URL;
const token = process.env.ACCESS_TOKEN;
describe("As a customer, I want to UPDATE my Order", () => {

    it("It should SUCCESS to change the name of the Customer", (done) => {
        chai.request(url)
            .get("/orders")
            .set("Authorization", "Bearer " + token)
            .then((response) => {
                assert.equal(response.status, 200);
                const orderId = response.body[1].id;

                chai.request(url)
                    .patch(`/orders/${orderId}`)
                    .set("Authorization", "Bearer " + token)
                    .send({
                        "customerName": "John Doe"
                      })
                    .then((response) => {
                        assert.equal(response.status, 204);
                        done();
                    });
            })
            .catch((error) => {
                done(error);
            });
    });

});