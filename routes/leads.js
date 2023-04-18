const express = require("express");

const router = express.Router();

// controller
const {
    uploadCsv,
    getUserSpecificLeeds,
    updateLead,
} = require("../controllers/leads");
const {
    validateRequest,
    validateUpdateRequest,
} = require("../middlewares/leads");

const {
    authMiddleware
} = require("../middlewares/auth");

router.get("/:userId", getUserSpecificLeeds);
router.post("/upload-csv", authMiddleware, validateRequest, uploadCsv);
router.put("/update/:leedId", authMiddleware, updateLead);

module.exports = router;
