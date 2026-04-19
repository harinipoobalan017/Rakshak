const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const {
  createIncident,
  getIncidents,
  updateStatus,
} = require("../controllers/incidentController");

// Create incident (authenticated users)
router.post("/", auth, upload.single("image"), createIncident);

// Get all incidents (authenticated users)
router.get("/", auth, getIncidents);

// Update incident status (responders and admins only)
router.patch("/:id/status", auth, roleCheck("responder", "admin"), updateStatus);

module.exports = router;