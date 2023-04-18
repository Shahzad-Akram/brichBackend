const express = require("express");

const router = express.Router();

const { checkUserId } = require("../middlewares/auth") // middleware

// controller
const {
    signUp, signIn,
} = require("../controllers/auth");

router.post("/signup", checkUserId, signUp);
router.post("/signin", checkUserId, signIn);


module.exports = router;