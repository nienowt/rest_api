'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var request = chai.request;
var expect = chai.expect;
require(__dirname + '/../server.js');
let Ghost = require(__dirname + '/../models/ghost-model');

describe('rest with mongo', () => {
  var ghostToken;
  var ghostId;

  before((done) => {
    Ghost.remove({},(err) => {
      if (err) console.log('err: ' + err);
      console.log('ghosts cleared');
      done();
    });
  });
  it('should store new ghost', (done) => {
    request('localhost:3000')
    .post('/pub/new-ghost')
    .auth('borte','password')
    .send({'isEvil':'true','numEyes':'164', 'powers':{'primary':'murder'}})
    .end((err, res) =>{
      expect(err).to.eql(null);
      expect(res.text).to.eql('Ghost Saved');
      done();
    });
  });
  it('should respond to post /login with token', (done) => {
    request('localhost:3000')
    .post('/pub/login')
    .auth('borte','password')
    .end((err, res) => {
      ghostToken = JSON.parse(res.text).token;
      expect(err).to.eql(null);
      expect(JSON.parse(res.text)).to.be.an('object');
      expect(ghostToken.length).to.eql(148);
      done();
    });
  });
  it('should deny access to /ghost/:id without proper token', (done) => {
    request('localhost:3000')
    .get('/api/ghosts/' + ghostId)
    .set('Authorization','token ' + ghostToken + 'bt')
    .end((err, res) => {
      expect(err.message).to.eql('Bad Request');
      expect(JSON.parse(res.text).msg).to.eql('ACCESS DENIED');
      done();
    });
  });
  it('should get ghosts', (done) => {
    request('localhost:3000')
    .get('/api/ghosts')
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      ghostId = res.body[0]._id;
      expect(res.body[0].name).to.eql('borte');
      expect(res.body[0].numEyes).to.eql(164);
      done();
    });
  });
  it('should get one ghost', (done) => {
    request('localhost:3000')
    .get('/api/ghosts/' + ghostId)
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('borte');
      expect(res.body.numEyes).to.eql(164);
      done();
    });
  });
  it('should respond to "put" with updated ghost stats', (done) => {
    request('localhost:3000')
    .put('/api/ghosts/' + ghostId)
    .set('Authorization','token ' + ghostToken)
    .send({'ghost':{'name':'PUT','isEvil':'false','numEyes':'21'}, 'powers':{'primary':'dolphin friendship','secondary':'depression'}})
    .end((err, res) =>{
      expect(err).to.eql(null);
      expect(res.text).to.eql('Ghost updated!');
      done();
    });
  });
  it('should respond to "delete" with delete message', (done) => {
    request('localhost:3000')
    .del('/api/ghosts/' + ghostId)
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.eql('GHOST BUSTED');
      done();
    });
  });
});
//
describe('/ghosteyes', () => {
  var ghostToken;
  before((done) => {
    request('localhost:3000')
    .post('/pub/new-ghost')
    .auth('borte','password')
    .send({'isEvil':'false','numEyes':'164', 'powers':{'primary':'murder'}})
    .end(() =>{
      done();
    });
  });
  before((done) => {
    request('localhost:3000')
    .post('/pub/new-ghost')
    .auth('bortle','password')
    .send({'isEvil':'true','numEyes':'164', 'powers':{'primary':'murder'}})
    .end(() =>{
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
  it('should respond with avg eyes for evil/non evil ghosts', (done) => {
    request('localhost:3000')
    .get('/api/ghosteyes')
    .set('Authorization','token ' + ghostToken)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.text).to.eql('Our Evil ghosts, on average, have 164 eyes, while our non-evil ghosts average 164 eyes');
      done();
    });
  });
});
