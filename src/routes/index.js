var express = require("express");
var router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const utilsRoutes = require("./utils.routes");
const postRoutes = require("./post.routes");
const adminRouter = require("./admin.routes");
const communityRouter = require("./community.routes");
const communityPostRouter = require("./community-post.routes");
const unsubscribeProfileRouter = require("./unsubscribeProfile.routes");
const userRewardDetailsRouter = require("./userRewardDetails.routes");
const seeFirstUserRouter = require("./seeFirstUser.routes");
const profileRouter = require("./profile.routes");
const dashboardRouter = require("./dashboard.routes");
const featuredChannels = require("./featured-channels.routes");
const userRealityRouter = require("./userReality.routes");
const advertizementRouter = require("./advertizment.routes");
const messageRouter = require("./message.routes");
const bugsAndReports = require("./bugs-reports.routes");
const subscribeChannelRouter = require("./subscribeChannel.routes");

router.use("/login", authRoutes);
router.use("/customers", userRoutes);
router.use("/admin", adminRouter);
router.use("/utils", utilsRoutes);
router.use("/posts", postRoutes);
router.use("/community", communityRouter);
router.use("/community-post", communityPostRouter);
router.use("/unsubscribe-profile", unsubscribeProfileRouter);
router.use("/user-reward-details", userRewardDetailsRouter);
router.use("/see-first-user", seeFirstUserRouter);
router.use("/profile", profileRouter);
router.use("/dashboard", dashboardRouter);
// Freedom tube routes //
router.use("/channels", featuredChannels);
router.use("/reality", userRealityRouter);
router.use("/advertizement", advertizementRouter);
router.use("/messages", messageRouter);
router.use("/bugs-reports", bugsAndReports);
router.use("/subscribe", subscribeChannelRouter);

module.exports = router;
