const chai = require("chai");
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');

const assert = chai.assert;

dotenv.config();
chai.use(chaiHttp);

const url = process.env.URL;
describe('As a customer, I want to see the Main Page', () => {

    it("It should SUCCESS to load Welcome Page", (done) => {
        chai.request(url)
            .get("/")
            .then((response) => {
                assert.equal(response.status, 200);
                assert.equal(response.body.message, "Welcome to the Simple Books API.");
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should SUCCESS to load Status Page", (done) => {
        chai.request(url)
            .get("/status")
            .then((response) => {
                assert.equal(response.status, 200);
                assert.equal(response.body.status, "OK");
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

});