const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const {
  updateLocation,
  getResponderLocations,
  getNearestResponders,
} = require("../controllers/locationController");

// Responder updates their live position
router.post("/update", auth, roleCheck("responder", "admin"), updateLocation);

// Get all active responder locations (admin + responder view)
router.get("/responders", auth, roleCheck("responder", "admin"), getResponderLocations);

// Get nearest responders to a coordinate (for dispatch)
router.get("/nearest", auth, roleCheck("admin"), getNearestResponders);

module.exports = router;
