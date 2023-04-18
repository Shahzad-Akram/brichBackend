const AWS = require("aws-sdk");
const uuid = require("uuid");

const {
  createOrUpdate,
  updateSpecficField,
  getUserById,
} = require("../common/db/db");

let db = new AWS.DynamoDB.DocumentClient();

module.exports.updateLead = async (req, res) => {
  try {
    const { leedId } = req.params;
    const { enoughBackyardSpace, leadStatus } = req.body;
    let params = {}
    if (leadStatus) {
      params = {
        TableName: "leeds",
        Key: {
          leedId,
        },
        UpdateExpression:
          "set leadStatus = :leadStatus",
        ExpressionAttributeValues: {
          ":leadStatus": leadStatus,

        },
      };
    }
    if (enoughBackyardSpace) {
      params = {
        TableName: "leeds",
        Key: {
          leedId,
        },
        UpdateExpression:
          "set   enoughBackyardSpace = :enoughBackyardSpace",
        ExpressionAttributeValues: {
          ":enoughBackyardSpace": enoughBackyardSpace,
        },
      };
    }

    await updateSpecficField(params);
    return res.status(200).send("Lead updated successfully!");
  } catch (error) {
    return res.status(500).send(error.toString());
  }
};

module.exports.uploadCsv = async (req, res) => {
  try {
    const { leads, userId } = req.body;
    const len = leads.length;

    for (let i = 0; i < len; i++) {
      const lead = {
        ...leads[i],
        userId,
        leedId: uuid.v4(),
      };
      await createOrUpdate(lead, "leeds");
    }
    // update count

    const { data } = await getUserById(userId, "userId", "users");
    if (!data) {
      throw "Something went wrong!";
    }

    const params = {
      TableName: "users",
      Key: {
        userId,
      },
      UpdateExpression: "set numOfLeads = :numOfLeads",
      ExpressionAttributeValues: {
        ":numOfLeads": len + data.numOfLeads,
      },
    };

    await updateSpecficField(params);
    return res.status(200).send("CSV Uploaded");
  } catch (error) {
    return res.status(500).send(error.toString());
  }
};

exports.getUserSpecificLeeds = async (req, res) => {
  const params = {
    TableName: "leeds",
    FilterExpression: "userId = :userid",
    ExpressionAttributeValues: {
      ":userid": req.params.userId,
    },
  };

  try {
    const result = await db.scan(params).promise();
    if (result.Items.length > 0) {
      return res.status(200).json({ data: result.Items });
    } else {
      return res.status(400).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "User fetch Failed." });
  }
};
