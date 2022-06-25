require("dotenv").config();

module.exports = {
  mediaServiceUrl: process.env.MEDIA_SERVICE_URL,
  userServiceUrl: process.env.USER_SERVICE_URL,
  courseServiceUrl: process.env.COURSE_SERVICE_URL,
  jwtAppSecret: process.env.JWT_APP_SECRET,
  jwtAppExpired: process.env.JWT_APP_EXPIRED,
  jwtAppExpiredRefresh: process.env.JWT_APP_EXPIRED_REFRESH,
  jwtAppSecretRefresh: process.env.JWT_APP_SECRET_REFRESH,
};
