/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/user-tweets              ->  index
 * POST    /api/user-tweets              ->  create
 * GET     /api/user-tweets/:id          ->  show
 * PUT     /api/user-tweets/:id          ->  upsert
 * PATCH   /api/user-tweets/:id          ->  patch
 * DELETE  /api/user-tweets/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import UserTweet from './user-tweet.model';
import twitterAPI from 'node-twitter-api';
import localconfig from '../../config/local.env.js';
import Promise from 'bluebird';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }
    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of UserTweets
export function index(req, res) {
  return UserTweet.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single UserTweet from the DB
export function show(req, res) {
  return UserTweet.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new UserTweet in the DB
export function create(req, res) {
  //Call twitter api with create request

  var twitter = new twitterAPI({
    consumerKey: localconfig.TWITTER_ID,
    consumerSecret: localconfig.TWITTER_SECRET,
    callback: 'http://localhost:3000'
  });

  var sname = req.body._id;
 // var sname = 'realdonaldtrump'; //For when using postman, not taking input correctly.

  var options = { screen_name: sname, count: 200};

  var userTweets = [];

  //Convert our nodeback API into a promise API 
  Promise.promisifyAll(twitter);

  //Now we can use it as a promise API! Appends Async to the original function name
  twitter.getTimelineAsync('user_timeline', options, localconfig.ACCESS_TOKEN,localconfig.ACCESS_TOKEN_SECRET).then(function(tweets) {
    //Parse api response and get the author, id of tweets, and messages. Then insert into db
    for (var i = 0; i < tweets.length; i++) {
      userTweets.push({'tweet_id': tweets[i].id, 'status': tweets[i].text, 'created_at': new Date(tweets[i].created_at)});
    }

    // console.log(userTweets);

    //Create object in database    
   return UserTweet.create({'_id': sname, 'tweets': userTweets})
    .then(respondWithResult(res, 200))
    .catch(handleError(res));

  }).catch(function(e) {
    console.error(e.stack); 
  });
}

// Upserts the given UserTweet in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return UserTweet.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing UserTweet in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return UserTweet.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a UserTweet from the DB
export function destroy(req, res) {
  return UserTweet.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
