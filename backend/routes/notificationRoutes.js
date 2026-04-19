const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getNotifications,
  markRead,
  markAllRead,
  getUnreadCount,
} = require("../controllers/notificationController");

// All routes require authentication
router.get("/", auth, getNotifications);
router.get("/unread-count", auth, getUnreadCount);
router.patch("/:id/read", auth, markRead);
router.patch("/read-all", auth, markAllRead);

module.exports = router;
