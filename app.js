const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const mediaRouter = require("./routes/media");
const userRouter = require("./routes/users");
const refreshTokenRouter = require("./routes/refreshToken");
const mentorsRouter = require("./routes/mentors");
const coursesRouter = require("./routes/courses");
const chapterRouter = require("./routes/chapters");
const lessonsRouter = require("./routes/lessons");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/media", mediaRouter);
app.use("/users", userRouter);
app.use("/refresh-tokens", refreshTokenRouter);
app.use("/mentors", mentorsRouter);
app.use("/courses", coursesRouter);
app.use("/chapters", chapterRouter);
app.use("/lessons", lessonsRouter);

module.exports = app;
