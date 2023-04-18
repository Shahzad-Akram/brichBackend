const express = require("express");

const router = express.Router();

// controller
const { getAllUsers, updateStatus, updateField } = require("../controllers/user");

router.get("/allusers", getAllUsers);
router.put("/status", updateStatus);
router.put("/update-field", updateField);


module.exports = router;
