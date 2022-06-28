const { create, getAll, update, destroy } = require("../controllers/reviews");

const router = require("express").Router();

router.get("/", getAll);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
