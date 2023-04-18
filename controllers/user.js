const {
  readAllUsers,
  createOrUpdate,
  updateSpecficField,
} = require("../common/db/db");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await readAllUsers("users");
    return res.status(200).json(result);
  } catch (err) {
    console.log("err--", err);
    res.status(500).json({ error: "User fetch Failed." });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(422).json({
        message: "ID is required",
      });
    }

    const params = {
      TableName: "users",
      Key: {
        userId,
      },
      UpdateExpression: "set isAllow = :isAllow",
      ExpressionAttributeValues: {
        ":isAllow": req.body.isAllow,
      },
    };

    await updateSpecficField(params);
    return res.status(200).json({ message: "Status has been updated" });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
};

exports.updateField = async (req, res) => {
  try {
    const { userId, link } = req.body;
    if (!userId) {
      return res.status(422).json({
        message: "ID is required",
      });
    }

    const params = {
      TableName: "users",
      Key: {
        userId,
      },
      UpdateExpression: "set link = :link",
      ExpressionAttributeValues: {
        ":link": link,
      },
    };

    await updateSpecficField(params);
    return res.status(200).json({ message: "Field has been updated" });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
};