const {
  getAll,
  create,
  get,
  update,
  destroy,
} = require("../controllers/lessons");

const router = require("express").Router();

router.get("/", getAll);
router.post("/", create);
router.get("/:id", get);
router.patch("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
