const recordsResolvers = require('./records');
const usersResolvers = require('./users');

module.exports = {
  Query: {
    ...recordsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...recordsResolvers.Mutation,
  }
};