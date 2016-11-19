'use strict';

import app from '../..';
import UserTweet from './user-tweet.model';
var userTweet;
var genUserTweet = function() {
  userTweet = new UserTweet({
    author: 'realdonaldtrump',
    tweets: [
      {
        id: 1,
        message: "Make America Great Again"
      }
    ]
  });
  return userTweet;
};

describe('UserTweet Model', function() {
  before(function() {
    // Clear users before testing
    return UserTweet.remove();
  });

  beforeEach(function() {
    genUserTweet();
  });

  afterEach(function() {
    return UserTweet.remove();
  });

  it('should begin with no users', function() {
    return expect(UserTweet.find({}).exec()).to
      .eventually.have.length(0);
  });
});
