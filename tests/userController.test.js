const request = require('supertest');
const app = require('../index.js');
require('../models/Transaction');

const mongoose = require('mongoose');
const keys = require('../config/keys');
let server;

beforeAll(async (done) => {
    server = require('http').createServer(app);
    server.listen(done);
    mongoose.Promise = global.Promise;
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
    });
});

afterAll(async (done) => {
    await mongoose.connection.close();
    await server.close(done);
});


describe('When a valid user hash is sent', () => {
  it('should retrieve all the transactions', async (done) => {
    const res = await request(app)
      .post('/api/user/getTransactions')
      .send({
        userHash:"0x741A4dCaD4f72B83bE9103a383911d78362611cf"
      });
    expect(res.statusCode).toEqual(200);
    done();
  });
})