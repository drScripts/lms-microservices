const { getNewToken } = require("../controllers/refresh-token");

const router = require("express").Router();

router.post("/", getNewToken);

module.exports = router;
