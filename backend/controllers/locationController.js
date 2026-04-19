const db = require("../config/db");

// In-memory store for real-time responder locations (fast access)
const liveLocations = new Map();

/**
 * Update responder's live location
 */
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, heading, speed } = req.body;
    const userId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Update in-memory store
    liveLocations.set(userId, {
      userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      heading: heading || null,
      speed: speed || null,
      updatedAt: new Date(),
    });

    // Persist to database (upsert)
    await db.execute(
      `INSERT INTO responder_locations (user_id, latitude, longitude, heading, speed) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       latitude = VALUES(latitude), 
       longitude = VALUES(longitude),
       heading = VALUES(heading),
       speed = VALUES(speed),
       updated_at = CURRENT_TIMESTAMP`,
      [userId, latitude, longitude, heading || null, speed || null]
    );

    // Broadcast to other clients via socket
    if (req.io) {
      req.io.to("admin").emit("responder_location", liveLocations.get(userId));
      req.io.to("responder").emit("responder_location", liveLocations.get(userId));
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all active responder locations
 */
exports.getResponderLocations = async (req, res) => {
  try {
    // First try in-memory (faster)
    if (liveLocations.size > 0) {
      const locations = Array.from(liveLocations.values()).filter((loc) => {
        // Only return locations updated within last 10 minutes
        const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
        return loc.updatedAt > tenMinsAgo;
      });
      return res.json(locations);
    }

    // Fallback to database
    const [rows] = await db.execute(
      `SELECT rl.*, u.name as responder_name 
       FROM responder_locations rl 
       JOIN users u ON rl.user_id = u.id 
       WHERE rl.updated_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
       ORDER BY rl.updated_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get nearest responders to a given location
 */
exports.getNearestResponders = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Haversine formula in SQL
    const [rows] = await db.execute(
      `SELECT rl.*, u.name as responder_name, u.phone,
       (6371 * acos(cos(radians(?)) * cos(radians(rl.latitude)) 
       * cos(radians(rl.longitude) - radians(?)) 
       + sin(radians(?)) * sin(radians(rl.latitude)))) AS distance 
       FROM responder_locations rl
       JOIN users u ON rl.user_id = u.id
       WHERE rl.updated_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
       HAVING distance < ?
       ORDER BY distance
       LIMIT 10`,
      [latitude, longitude, latitude, radius]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export the in-memory store for socket service
exports.liveLocations = liveLocations;
