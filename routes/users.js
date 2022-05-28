const {
  register,
  login,
  profile,
  update,
  logout,
} = require("../controllers/users");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const os = require("os");
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", jwtMiddleware, logout);
router.get("/profile", jwtMiddleware, profile);
router.patch("/", [jwtMiddleware, upload.single("media")], update);

module.exports = router;
