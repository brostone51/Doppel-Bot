'use strict';

var app = require('../..');
import request from 'supertest';

var newUserTweet;

describe('UserTweet API:', function() {
  describe('GET /api/user-tweets', function() {
    var userTweets;

    beforeEach(function(done) {
      request(app)
        .get('/api/user-tweets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          userTweets = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(userTweets).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/user-tweets', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/user-tweets')
        .send({
          author: '@newauthor',
          tweets: [
            {
              id: 1,
              message: 'This is a new tweet'
            },
            {
              id: 2,
              message: 'Hello World'
            }
          ] 
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newUserTweet = res.body;
          done();
        });
    });

    it('should respond with the newly created userTweet', function() {
      expect(newUserTweet.author).to.equal('@newauthor');
      expect(newUserTweet.tweets[0].id).to.equal(1);
      expect(newUserTweet.tweets[0].message).to.equal('This is a new tweet');
      expect(newUserTweet.tweets[1].id).to.equal(2);
      expect(newUserTweet.tweets[1].message).to.equal('Hello World');
    });
  });

  describe('GET /api/user-tweets/:id', function() {
    var userTweet;

    beforeEach(function(done) {
      request(app)
        .get(`/api/user-tweets/${newUserTweet._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          userTweet = res.body;
          done();
        });
    });

    afterEach(function() {
      userTweet = {};
    });

    it('should respond with the requested userTweet', function() {
      expect(userTweet.author).to.equal('@newauthor');
      expect(userTweet.tweets[0].id).to.equal(1);
      expect(userTweet.tweets[0].message).to.equal('This is a new tweet');
      expect(userTweet.tweets[1].id).to.equal(2)
      expect(userTweet.tweets[1].message).to.equal('Hello World');
    });
  });

  describe('PUT /api/user-tweets/:id', function() {
    var updatedUserTweet;

    beforeEach(function(done) {
      request(app)
        .put(`/api/user-tweets/${newUserTweet._id}`)
        .send({
          author: '@newauthor',
          tweets: [
            {
              id: 1,
              message: 'This is a new tweet'
            },
            {
              id: 2,
              message: 'Hello World'
            }
          ] 
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedUserTweet = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUserTweet = {};
    });

    it('should respond with the original userTweet', function() {
      expect(updatedUserTweet.author).to.equal('@newauthor');
      expect(updatedUserTweet.tweets[0].id).to.equal(1);
      expect(updatedUserTweet.tweets[0].message).to.equal('This is a new tweet');
      expect(updatedUserTweet.tweets[1].id).to.equal(2)
      expect(updatedUserTweet.tweets[1].message).to.equal('Hello World');
    });

    it('should respond with the updated userTweet on a subsequent GET', function(done) {
      request(app)
        .get(`/api/user-tweets/${newUserTweet._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let userTweet = res.body;

          expect(userTweet.author).to.equal('@newauthor');
          expect(userTweet.tweets[0].id).to.equal(1);
          expect(userTweet.tweets[0].message).to.equal('This is a new tweet');
          expect(userTweet.tweets[1].id).to.equal(2)
          expect(userTweet.tweets[1].message).to.equal('Hello World');

          done();
        });
    });
  });

  describe('PATCH /api/user-tweets/:id', function() {
    var patchedUserTweet;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/user-tweets/${newUserTweet._id}`)
        .send([
          { op: 'replace', path: '/author', value: 'Patched UserTweet' },
          { op: 'replace', path: '/tweets', value: 'This is the patched userTweet!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedUserTweet = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedUserTweet = {};
    });

    it('should respond with the patched userTweet', function() {
      expect(patchedUserTweet.name).to.equal('Patched UserTweet');
      expect(patchedUserTweet.info).to.equal('This is the patched userTweet!!!');
    });
  });

  describe('DELETE /api/user-tweets/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/user-tweets/${newUserTweet._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when userTweet does not exist', function(done) {
      request(app)
        .delete(`/api/user-tweets/${newUserTweet._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
