const {
  register,
  login,
  update,
  show,
  list,
  logout,
} = require("../controllers/users");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/:id", update);
router.get("/:id", show);
router.get("/", list);

module.exports = router;
