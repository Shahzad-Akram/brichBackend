const uuid = require("uuid");

module.exports.validateRequest = (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  next();
};

module.exports.validateUpdateRequest = (req, res, next) => {
  const { leedId } = req.params;
  if (!leedId) {
    return res.status(400).json({
      message: "Leed ID is required",
    });
  }

  const { enoughBackyardSpace, leadStatus } = req.body;

  if (!enoughBackyardSpace && !leadStatus) {
    return res.status(400).json({
      message:
        "enoughBackyardSpace & leadStatus, both should not have falsy value",
    });
  }

  next();
};
