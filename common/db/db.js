const AWS = require("aws-sdk");
const uuid = require("uuid");

const Table = "users";

let db = new AWS.DynamoDB.DocumentClient();
// const db = new AWS.DynamoDB({ region: 'us-east-1' });

// Create or Update users
exports.createOrUpdate = async (data, table) => {
  const params = {
    TableName: table,
    Item: data,
  };

  try {
    await db.put(params).promise();
    return {};
  } catch (error) {
    throw error;
  }
};

// update specfic field
exports.updateSpecficField = async (params) => {
  try {
    return await db.update(params).promise();
  } catch (e) {
    throw e;
  }
};

// Read all users
exports.readAllUsers = async (table) => {
  const params = {
    TableName: table,
  };

  try {
    const { Items } = await db.scan(params).promise();
    return { success: true, data: Items };
  } catch (error) {
    throw error;
  }
};

// Read Users by ID
exports.getUserById = async (value, key, table) => {
  const params = {
    TableName: table,
    Key: {
      [key]: value,
    },
  };
  try {
    const { Item } = await db.get(params).promise();
    return { success: true, data: Item };
  } catch (error) {
    return { success: false, data: null };
  }
};

// Delete User by ID
exports.deleteUserById = async (value, key = "id") => {
  const params = {
    TableName: Table,
    Key: {
      [key]: parseInt(value),
    },
  };

  try {
    await db.delete(params).promise();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// export {
//     createOrUpdate,
//     readAllUsers,
//     getUserById,
//     deleteUserById
// }
