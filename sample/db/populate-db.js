const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const uuid = require("uuid");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

const timestamp = new Date().getTime();
const params = {
  TableName: "db-dev",
  Item: {
    id: uuid.v1(),
    text: "this has been populated",
    checked: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
};

// write the todo to the database
dynamodb.put(params, (error) => {
  // handle potential errors
  if (error) {
    console.error(error);
    callback(null, {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the todo item.",
    });
    return;
  } else {
    console.log("Populate db-dev done !");
  }
});
