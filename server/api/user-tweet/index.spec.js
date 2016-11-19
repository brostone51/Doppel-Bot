'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userTweetCtrlStub = {
  index: 'userTweetCtrl.index',
  show: 'userTweetCtrl.show',
  create: 'userTweetCtrl.create',
  upsert: 'userTweetCtrl.upsert',
  patch: 'userTweetCtrl.patch',
  destroy: 'userTweetCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userTweetIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './user-tweet.controller': userTweetCtrlStub
});

describe('UserTweet API Router:', function() {
  it('should return an express router instance', function() {
    expect(userTweetIndex).to.equal(routerStub);
  });

  describe('GET /api/user-tweets', function() {
    it('should route to userTweet.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'userTweetCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/user-tweets/:id', function() {
    it('should route to userTweet.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'userTweetCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/user-tweets', function() {
    it('should route to userTweet.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'userTweetCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/user-tweets/:id', function() {
    it('should route to userTweet.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'userTweetCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/user-tweets/:id', function() {
    it('should route to userTweet.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'userTweetCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/user-tweets/:id', function() {
    it('should route to userTweet.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'userTweetCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
