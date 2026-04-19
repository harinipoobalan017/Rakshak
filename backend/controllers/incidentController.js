const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { emitNewIncident, emitStatusUpdate } = require("../services/socketService");
const { sendAlertEmail } = require("../services/emailService");

// CREATE
exports.createIncident = async (req, res) => {
  try {
    const { type, description, severity, latitude, longitude, address } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const [result] = await db.execute(
      `INSERT INTO incidents 
      (type, description, severity, latitude, longitude, address, image_url, reported_by)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        type,
        description,
        severity,
        latitude,
        longitude,
        address,
        imageUrl,
        req.user ? req.user.id : null   // ✅ FIXED ONLY THIS
      ]
    );

    const [rows] = await db.execute("SELECT * FROM incidents WHERE id=?", [result.insertId]);

    emitNewIncident(rows[0]);
    await sendAlertEmail(rows[0]);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS + ASSIGN
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;

  await db.execute(
    "UPDATE incidents SET status=?, assigned_to=? WHERE id=?",
    [status, assigned_to, id]
  );

  await db.execute(
    "INSERT INTO incident_logs (incident_id, action, performed_by) VALUES (?,?,?)",
    [id, `Status changed to ${status}`, req.user.id]
  );

  emitStatusUpdate(id, status);

  res.json({ success: true });
};

// GET
exports.getIncidents = async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM incidents");
  res.json(rows);
};

// GOOGLE FORM
exports.handleFormWebhook = async (req, res) => {
  const { type, description, severity, address, latitude, longitude } = req.body;

  const [result] = await db.execute(
    `INSERT INTO incidents (type, description, severity, latitude, longitude, address, source)
     VALUES (?,?,?,?,?,?,'google_form')`,
    [type, description, severity, latitude, longitude, address]
  );

  const [rows] = await db.execute("SELECT * FROM incidents WHERE id=?", [result.insertId]);

  emitNewIncident(rows[0]);

  res.json({ success: true });
};