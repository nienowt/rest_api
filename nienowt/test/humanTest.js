'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var request = chai.request;
var expect = chai.expect;
require(__dirname + '/../server.js');

let Human = require(__dirname + '/../models/human-model');

describe('human routes', () => {
  var humanId;
  var ghostToken;

  before((done) => {
    Human.remove({},(err) => {
      if (err) console.log('err: ' + err);
      console.log('humans cleared');
      done();
    });
  });
  before('should respond to post /login with token', (done) => {
    request('localhost:3000')
    .post('/pub/login')
    .auth('borte','password')
    .end((err, res) => {
      ghostToken = JSON.parse(res.text).token;
      done();
    });
  });
  it('should store new human', (done) => {
    request('localhost:3000')
    .post('/api/humans')
    .set('Authorization','token ' + ghostToken)
    .send({'name':'pelt', 'isCool':'false','numTeeth':'15'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('pelt');
      humanId = res.body._id;
      done();
    });
  });
  it('should return humans on GET', (done) => {
    request('localhost:3000')
    .get('/api/humans')
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      console.log(res.body);
      expect(res.body[0].name).to.eql('pelt');
      done();
    });
  });
  it('should return human on GET/id', (done) => {
    request('localhost:3000')
    .get('/api/humans/' + humanId)
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('pelt');
      done();
    });
  });
  it('should return altered human on PUT', (done) => {
    request('localhost:3000')
    .put('/api/humans/' + humanId)
    .set('Authorization','token ' + ghostToken)
    .send({'name':'pelted', 'isCool':'true','numTeeth':'14'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.eql('HUMAN ALTERED');
      done();
    });
  });
  it('should delete human', (done) => {
    request('localhost:3000')
    .del('/api/humans/' + humanId)
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.eql('HUMAN ELIMINATED');
      done();
    });
  });
});

describe('human non crud endpoints', () => {
  var ghostToken;
  before('should respond to post /login with token', (done) => {
    request('localhost:3000')
    .post('/pub/login')
    .auth('borte','password')
    .end((err, res) => {
      ghostToken = JSON.parse(res.text).token;
      done();
    });
  });
  before((done) => {
    request('localhost:3000')
    .post('/api/humans')
    .set('Authorization','token ' + ghostToken)
    .send({'name':'pelt', 'isCool':'false','numTeeth':'15'})
    .end(() => {
      done();
    });
  });
  it('should respond with the number of teeth the humans have', (done) => {
    request('localhost:3000')
    .get('/api/howmanyteethdothehumanshavecollectively')
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.eql('Altogether the humans have 15 teeth');
      done();
    });
  });
  it('should respond with the number of cool humans', (done) => {
    request('localhost:3000')
    .get('/api/howmanyofthesehumansarecool')
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.eql('0 of the humans in our database can be considered reliably cool');
      done();
    });
  });
});
