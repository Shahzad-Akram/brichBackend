const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

let db = new AWS.DynamoDB.DocumentClient();

module.exports.checkUserId = (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        req.body.userId = uuid.v4();
    }
    next();
};

module.exports.authMiddleware = async (req, res, next) => {
    console.log('headers', req.headers)
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Unauthorized access! Please sign in to continue." })
    }
    const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json(
            {
                message: "Unauthorized accsess! Please sign in to continue.",
            }
        )
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        //check if user exists
        const params = {
            TableName: 'users',
            FilterExpression: 'userId = :userid',
            ExpressionAttributeValues: {
                ':userid': decoded.id
            }
        };

        const user = await db.scan(params).promise()


        if (user.Items.length === 0) {
            return res.status(401).json(
                { message: "Unauthorized access! User not exists", }
            )
        }

        //inject the user to request object
        req.user = user.Items[0];
        next();
    } catch (error) {
        // console.log("auth error ", error);
        return res.status(500).json({ message: error.message });
    }
};