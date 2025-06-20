const express = require("express");
const pool = require("../config/database");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

// Validation Helpers
const validateMusicianData = (data) => {
  const errors = [];

  // 1) Check required fields exist and are not empty
  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!data.location || data.location.trim() === "") {
    errors.push("Location is required");
  }

  if (!data.experience_level || data.experience_level.trim() === "") {
    errors.push("Experience level is required");
  }

  if (
    !data.instruments ||
    !Array.isArray(data.instruments) ||
    data.instruments.length === 0
  ) {
    errors.push("At least one instrument is required");
  }

  // 2) Validate data types and formats
  if (data.name && typeof data.name !== "string") {
    errors.push("Name must be a string");
  }

  if (data.name && data.name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (data.bio && typeof data.bio !== "string") {
    errors.push("Bio must be a string");
  }

  if (data.bio && data.bio.length > 500) {
    errors.push("Bio must be less than 500 characters");
  }

  // 3) Validate specific enum values
  const validExperienceLevels = ["beginner", "intermediate", "professional"];
  if (
    data.experience_level &&
    !validExperienceLevels.includes(data.experience_level)
  ) {
    errors.push(
      "Experience level must be beginner, intermediate, or professional"
    );
  }

  // 4) Validate arrays
  if (data.instruments && Array.isArray(data.instruments)) {
    if (data.instruments.some((instrument) => typeof instrument !== "string")) {
      errors.push("All instruments must be strings");
    }
  }

  if (data.genres && !Array.isArray(data.genres)) {
    errors.push("Genres must be an array");
  }

  // 5) Validate numbers
  if (data.years_experience !== undefined) {
    if (
      typeof data.years_experience !== "number" ||
      data.years_experience < 0 ||
      data.years_experience > 70
    ) {
      errors.push("Years of experience must be a number between 0 and 70");
    }
  }

  // 6) Validate booleans
  if (
    data.available_for_gigs !== undefined &&
    typeof data.available_for_gigs !== "boolean"
  ) {
    errors.push("Available for gigs must be true or false");
  }

  if (
    data.looking_for_band !== undefined &&
    typeof data.looking_for_band !== "boolean"
  ) {
    errors.push("Looking for band must be true or false");
  }

  // 7) Return validation result
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};
const validateVenueData = (data) => {};

//Route Handlers
router.post("/musician", requireAuth, createMusicianProfile);
router.post("/venue", requireAuth, createVenueProfile);
router.get("/me", requireAuth, getCurrentUserProfile);
router.put("/me", reguireAuth, updateCurrentUserProfile);
router.get("/:id", getPublicProfile);

module.exports = router;
