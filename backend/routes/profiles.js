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
const validateVenueData = (data) => {
  // Initialize error collection array
  const errors = [];

  // ========== REQUIRED FIELDS VALIDATION ==========
  // Check if business_name exists and is not empty/whitespace
  if (!data.business_name || data.business_name.trim() === "") {
    errors.push("Venue Name is required");
  }

  // Check if location exists and is not empty/whitespace
  if (!data.location || data.location.trim() === "") {
    errors.push("Location is required");
  }

  // Check if venue_type exists and is not empty/whitespace
  if (!data.venue_type || data.venue_type.trim() === "") {
    errors.push("Venue Type is required");
  }

  // Check if capacity exists and is a valid number
  if (!data.capacity || typeof data.capacity !== "number") {
    errors.push("Capacity is a number");
  }

  // ========== DATA TYPE VALIDATION ==========
  // Validate business_name is a string (if it exists)
  if (data.business_name && typeof data.business_name !== "string") {
    errors.push("Venue Name needs to be a string");
  }

  // Validate business_name length is under 100 characters (if it exists)
  if (data.business_name && data.business_name.length > 100) {
    errors.push("Venue name can not exceed 100 characters!");
  }

  // Validate bio is a string (if it exists)
  if (data.bio && typeof data.bio !== "string") {
    errors.push("Bio needs to be a string");
  }

  // Validate bio length is under 500 characters (if it exists)
  if (data.bio && data.bio.length > 500) {
    errors.push("Bio needs to be less than 500 characters");
  }

  // Validate location length is under 100 characters (if it exists)
  if (data.location && data.location.length > 100) {
    errors.push("Location needs to be under 100 characters");
  }

  // ========== ENUM VALIDATION ==========
  // Create array of valid venue types (match your database schema)
  const validVenueTypes = [
    "bar",
    "restaurant",
    "club",
    "event_hall",
    "theater",
    "cafe",
    "other",
  ];
  if (data.venue_type && !validVenueTypes.includes(data.venue_type)) {
    errors.push(
      "Venue type must be one of: bar, restaurant, club, event Hall, theater, cafe, or other"
    );
  }

  // Check if venue_type is in the valid options list
  if (data.venue_type && !validVenueTypes.includes(data.venue_type)) {
    errors.push(
      "Venue type must be one of: bar, restaurant, club, event_hall, theater, cafe, or other"
    );
  }

  // ========== NUMBER VALIDATION ==========
  // Validate capacity is a positive number within reasonable range (10-100000?)
  if (data.capacity !== undefined) {
    if (
      typeof data.capacity !== "number" ||
      data.capacity < 10 ||
      data.capacity > 100000
    ) {
      errors.push("Capacity must be a number between 10 and 100,000");
    }
  }

  // ========== OPTIONAL FIELD VALIDATION ==========
  // Validate contact_person is a string and reasonable length (if provided)
  if (data.contact_person !== undefined) {
    if (typeof data.contact_person !== "string") {
      errors.push("Contact person must be a string");
    }
    if (data.contact_person && data.contact_person.length > 100) {
      errors.push("Contact person name must be less than 100 characters");
    }
  }

  // Validate phone_number format/length (if provided)
  if (data.phone_number !== undefined) {
    if (typeof data.phone_number !== "string") {
      errors.push("Phone number must be a string");
    }
    if (data.phone_number && data.phone_number.length > 20) {
      errors.push("Phone number must be less than 20 characters");
    }
  }

  // Validate website_url is a valid URL format (if provided)
  // Hint: Check if it starts with http:// or https://
  if (data.website_url !== undefined) {
    if (typeof data.website_url !== "string") {
      errors.push("Website URL must be a string");
    }
    if (data.website_url && data.website_url.length > 500) {
      errors.push("Website URL must be less than 500 characters");
    }
    if (
      data.website_url &&
      !data.website_url.startsWith("http://") &&
      !data.website_url.startsWith("https://")
    ) {
      errors.push("Website URL must start with http:// or https://");
    }
  }

  // ========== RETURN VALIDATION RESULT ==========
  // Return object with isValid boolean and errors array
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

//Route Handlers
router.post("/musician", requireAuth, createMusicianProfile);
router.post("/venue", requireAuth, createVenueProfile);
router.get("/me", requireAuth, getCurrentUserProfile);
router.put("/me", reguireAuth, updateCurrentUserProfile);
router.get("/:id", getPublicProfile);

module.exports = router;
