'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

var UserTweetSchema = new Schema({
  _id: String,
  tweets: [String]
});

/**
 * Virtuals
 */

/**
 * Validations
 */

var validatePresenceOf = function(value) {
  return value && value.length;
};


/**
 * Methods
 */
//UserTweetSchema.methods = {
//}

export default mongoose.model('UserTweet', UserTweetSchema);
