const ApiBuilder = require('claudia-api-builder'),
    AWS = require('aws-sdk');
var api = new ApiBuilder(),
    dynamoDb = new AWS.DynamoDB.DocumentClient();

api.post('/user', function (request) {
  var params = {
    TableName: 'dynamo-test',
    Item: {
        userid: request.body.userid,
        token: request.body.token
    }
  }
  return dynamoDb.put(params).promise();
}, { success: 201 });

api.get('/user', function (request) {
  return dynamoDb.scan({ TableName: 'dynamo-test' }).promise()
      .then(response => response.Items)
});

api.get('/user/{id}', function (request) {
  return dynamoDb.get({ TableName: 'dynamo-test', Key: { userid: request.pathParams.id } }).promise()
      .then(response => response.Item)
});

api.delete('/user/{id}', function (request) {
  return dynamoDb.delete({ TableName: 'dynamo-test', Key: { userid: request.pathParams.id } }).promise()
      .then(response => 'Token deleted.')
});

module.exports = api;
