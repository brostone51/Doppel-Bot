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
itt
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

  //Parse api response and get the author, id of tweets, and messages. Then insert into db

  return UserTweet.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
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
