const { create, getAll } = require("../controllers/user-courses");

const router = require("express").Router();

router.post("/", create);
router.get("/", getAll);

module.exports = router;
