const AWS = require("aws-sdk");
const { createOrUpdate, updateSpecficField } = require("../common/db/db");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

let db = new AWS.DynamoDB.DocumentClient();

exports.signUp = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        RELicenseState,
        RELicenseNumber,
        password,
        cpassword,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !RELicenseState ||
        !RELicenseNumber ||
        !password ||
        !cpassword
    ) {
        return res
            .status(422)
            .json({ err: "Please fill out all the given fields!" });
    }

    if (password !== cpassword) {
        return res.status(422).json({ err: "Pasword doesn't match!" });
    }

    const params = {
        TableName: "users",
        FilterExpression: "email = :e",
        ExpressionAttributeValues: {
            ":e": email,
        },
    };

    try {
        req.body.password = await bcrypt.hash(password, 12);
        req.body.cpassword = await bcrypt.hash(cpassword, 12);
        const result = await db.scan(params).promise();
        if (result.Items.length > 0) {
            return res.status(422).json({ message: "Email already exists." });
        } else {
            req.body.lastLoginTime = new Date().getTime();
            createOrUpdate(req.body, "users");
            res.status(200).json({
                message: "Request for signin has been submitted Successfully.",
            });
        }
    } catch (err) {
        console.log("err--", err);
        res.status(500).json({ error: "User SignUp Failed." });
    }
};

exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    const params = {
        TableName: "users",
        FilterExpression: "email = :e",
        ExpressionAttributeValues: {
            ":e": email,
        },
    };

    try {
        const result = await db.scan(params).promise();
        if (result.Items.length > 0) {
            if (!result.Items[0].isAllow) {
                return res
                    .status(400)
                    .json({ message: "User is not allowed to signin" });
            }

            let token = jwt.sign(
                { id: result.Items[0].userId },
                process.env.SECRET_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || "24h", // expires in 24 hours
                }
            );

            const isMatch = await bcrypt.compare(password, result.Items[0].password);

            if (!isMatch) {
                return res.status(422).json({ message: "Invalid password" });
            }

            const params = {
                TableName: "users",
                Key: {
                    userId: result.Items[0].userId,
                },
                UpdateExpression: "set lastLoginTime = :lastLoginTime",
                ExpressionAttributeValues: {
                    ":lastLoginTime": new Date().getTime(),
                },
            };

            await updateSpecficField(params);

            return res.status(200).json({
                authToken: token,
                userLogin: result.Items[0],
            });
        } else {
            // return res.status(400).json({ msg: "Invalid Credentials" });
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        console.log("err--", err);
        res.status(500).json({ error: "User SignIn Failed." });
    }
};
