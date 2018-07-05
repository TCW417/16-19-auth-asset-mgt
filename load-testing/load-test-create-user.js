'use strict';

const faker = require('faker');
const uuid = require('uuid/v4');
const loadTestHelpers  = module.exports = {};

loadTestHelpers.create = (requestParams, context, ee, next) => {
  // properties from my account schema
  context.vars.username = faker.internet.userName();
  context.vars.email = faker.internet.email();
  context.vars.password = faker.internet.password(); //

  // properties from my profile schema
  context.vars.bio = faker.lorem.words(10);
  context.vars.firstName = faker.name.firstName();
  context.vars.lastName = faker.name.lastName();
  return next();
}

loadTestHelpers.savedData = [];

// afterResponse used on /api/signup to capture token
loadTestHelpers.saveToken = (requestParams, response, context, ee, next) => {
  loadTestHelpers.savedData.push(response.body);
  return next();
}


loadTestHelpers.retrieveToken = (requestParams, context, ee, next) => {
  context.vars.token = loadTestHelpers.savedData.length ? loadTestHelpers.savedData.pop().token : '0';
  return next();
}
