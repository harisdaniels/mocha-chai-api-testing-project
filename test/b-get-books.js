const chai = require("chai");
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');

const assert = chai.assert;

dotenv.config();
chai.use(chaiHttp);

const url = process.env.URL;
describe('As a customer, I want to see ALL kind of available Books', () => {
    
    it("It should SUCCESS to load ALL List of books", (done) => {
        chai.request(url)
            .get("/books")
            .then((response) => {
                assert.equal(response.status, 200);
                assert.containsAllKeys(response.body[0], ["id", "name", "type", "available"]);
                assert.isNumber(response.body[0].id);
                assert.isString(response.body[0].name);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should SUCCESS to load ALL List of FICTION books with VALID Query Parameter", (done) => {
        chai.request(url)
            .get("/books")
            .query({ type : "fiction" })
            .then((response) => {
                assert.equal(response.status, 200);

                assert.equal(response.body[0].id, 1);
                assert.equal(response.body[0].name, "The Russian");
                assert.equal(response.body[0].available, true);

                assert.equal(response.body[1].id, 3);
                assert.equal(response.body[1].name, "The Vanishing Half");
                assert.equal(response.body[1].available, true);

                assert.equal(response.body[2].id, 4);
                assert.equal(response.body[2].name, "The Midnight Library");
                assert.equal(response.body[2].available, true);

                assert.equal(response.body[3].id, 6);
                assert.equal(response.body[3].name, "Viscount Who Loved Me");
                assert.equal(response.body[3].available, true);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should SUCCESS to load ALL List of NON-FICTION books with VALID Query Parameter", (done) => {
        chai.request(url)
            .get("/books")
            .query({ type : "non-fiction" })
            .then((response) => {
                assert.equal(response.status, 200);

                assert.equal(response.body[0].id, 2);
                assert.equal(response.body[0].name, "Just as I Am");
                assert.equal(response.body[0].available, false);

                assert.equal(response.body[1].id, 5);
                assert.equal(response.body[1].name, "Untamed");
                assert.equal(response.body[1].available, true);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should SUCCESS to load List of FICTION books with VALID Query Parameter and LIMIT 2", (done) => {
        chai.request(url)
            .get("/books")
            .query({ type : "fiction", limit : 2 })
            .then((response) => {
                assert.equal(response.status, 200);

                assert.equal(response.body[0].id, 1);
                assert.equal(response.body[0].name, "The Russian");

                assert.equal(response.body[1].id, 3);
                assert.equal(response.body[1].name, "The Vanishing Half");
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
   
    it("It should give ERROR message while inputing LIMIT with VALID Query Parameter BUT with INVALID LIMIT Number", (done) => {
        chai.request(url)
            .get("/books")
            .query({ type : "fiction", limit : 25 })
            .then((response) => {
                assert.equal(response.status, 400);
                assert.equal(response.body.error, "Invalid value for query parameter 'limit'. Cannot be greater than 20.");
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("It should SUCCESS to load a SINGLE BOOK with Valid PATH Parameter", (done) => {
        chai.request(url)
            .get("/books")
            .then((response) => {
                assert.equal(response.status, 200);
                const bookId = response.body[0].id;

                return chai.request(url)
                    .get(`/books/${bookId}`)
                    .then((response) => {
                        assert.equal(response.status, 200);
                        assert.containsAllKeys(response.body, ["id", "name", "author", "isbn", "type", "price", "current-stock","available"]);
                        assert.isNumber(response.body.id);
                        assert.isString(response.body.name);

                        if (response.status !== 200) {
                            assert.equal(response.status, 404);
                            assert.equal(response.body.error, `No book with id ${bookId}`);
                        }
                        done();
                    });
            })
            .catch((error) => {
                return done(error);
            });
    });

});