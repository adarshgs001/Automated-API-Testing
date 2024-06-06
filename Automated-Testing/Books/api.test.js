const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;

chai.use(chaiHttp);

/* Verify Posting a Book

Our first test is the test for successful creation of a book by making a POST request to the /books endpoint of the 
API server and checking the response for expected properties and values. The bookId is also captured for potential 
use in subsequent test cases.
First, we set a test suite with the describe function from the Mocha framework and then we declare a variable 
bookId to store the id of the book created during the test:

*/

describe('Books API', () => {
    let bookId;

    /* We define our first test case with the it function from Mocha. It represents an individual test scenario. In this 
case, it tests the functionality of posting a book to the API.
Then, we define a book object with properties such as id, title, and author. It represents the book that will be 
sent as a POST request payload to the API: */

    it('should POST a book', (done) => {
        const book = {id: "1", title: "Test Book", author: "Test Author"};
        /* We use Chai HTTP to make a POST request to the /books endpoint of the API server. It sends the book
        object as the request payload: */
        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                /* Then, we start making assertions that the response has a status code of 201, indicating a successful creation of the 
                book resource, that the response body is an object, that the response body has properties called id, title and author. Finally, we assign the value of the id property from the response body to the bookId variable that we 
                declared earlier and we signal the completion of the test case by calling done() */
                expect(res).to.have.status('201');
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('author');
                bookId = res.body.id;
                done();
            })
    });

    it('should GET all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should GET a single book', (done) => {
        const bookId = 1;

        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                done();
            });
    });

    it('should PUT an existing book', (done) => {
        const bookId = 1;
        const updatedBook = {id: bookId, title: "Updated Test Book", author: "Updated Test Author"};
        chai.request(server)
            .put(`/books/${bookId}`)
            .send(updatedBook)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.title).to.equal('Updated Test Book');
                expect(res.body.author).to.equal('Updated Test Author');
                done();
            });
    });

    it('should return 404 when trying to GET, PUT or DELETE a non-existing book', (done) => {
        chai.request(server)
            .get('/books/9999')
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai.request(server)
            .put('/books/9999')
            .send({id: "9999", title: "Non-existing Book", author: "Non-existing Author"})
            .end((err, res) => {
                expect(res).to.have.status(404);
            });
        
        chai.request(server)
            .delete('/books/9999')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
})