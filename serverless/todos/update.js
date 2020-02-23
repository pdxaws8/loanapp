'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.firstname !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the todo item.',
    });
    return;
  }

  // const params = {
  //   TableName: process.env.DYNAMODB_TABLE,
  //   Key: {
  //     id: event.pathParameters.id,
  //   },
  //   ExpressionAttributeNames: {
  //     '#todo_text': 'text',
  //   },
  //   ExpressionAttributeValues: {
  //     ':text': data.text,
  //     ':checked': data.checked,
  //     ':updatedAt': timestamp,
  //     ':address': address,
  //     ':lengthofstay': lengthofstay,
  //     ':employerName': employerName,
  //     ':employerAddress': employerAddress,
  //     ':loanAmount': loanAmount,
  //   },
  //   UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt, address = :address, lengthofstay = :lengthofstay, employerName = :employerName, employerAddress = :employerAddress, loanAmount = :loanAmount',
  //   ReturnValues: 'ALL_NEW',
  // };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: event.pathParameters.id,
      firstname: data.firstname,
      lastname: data.lastname,
      emailid: data.emailid,
      dob: data.dob,
      ssn: data.ssn,
      phoneno: data.phoneno,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      address: data.address,
      lengthofstay: data.lengthofstay,
      employerName: data.employerName,
      employerAddress: data.employerAddress,
      loanAmount: 0,
    },
  };

  // update the todo in the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
