/**
 * UserTweet model events
 */

'use strict';

import {EventEmitter} from 'events';
import UserTweet from './user-tweet.model';
var UserTweetEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserTweetEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  UserTweet.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    UserTweetEvents.emit(event + ':' + doc._id, doc);
    UserTweetEvents.emit(event, doc);
  };
}

export default UserTweetEvents;
