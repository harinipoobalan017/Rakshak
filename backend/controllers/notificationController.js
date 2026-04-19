const db = require("../config/db");

/**
 * Get notifications for authenticated user
 */
exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Mark notification as read
 */
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Mark all notifications as read
 */
exports.markAllRead = async (req, res) => {
  try {
    await db.execute(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get unread count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [req.user.id]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create a notification (internal use by other controllers)
 */
exports.createNotification = async (userId, title, message, type = "system", refId = null) => {
  try {
    await db.execute(
      `INSERT INTO notifications (user_id, title, message, type, ref_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, message, type, refId]
    );
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};
