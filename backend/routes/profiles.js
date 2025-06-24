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
const createMusicianProfile = async (req, res) => {
  try {
    const existingProfile = await pool.query(
      // Creating a variable named existingProfile and then using pool to query the database
      "SELECT id FROM musician_profiles WHERE user_id = $1", // This checks to see if musician profile already exists.  Validation so multiple profiles are not made for same user.
      [req.session.userId] // THis is checking the session for the userId
    );

    if (existingProfile.rows.length > 0) {
      // THis is checking to see if there are any profiles for the user
      return res.status(400).json({
        // HTTP status 400 (bad request)
        success: false, // JSON response false
        message: "user already has a musician profile", // These lines will send an error  because the user already has a profile if more than 0
      });
    }

    // Validate data
    const validationResult = validateMusicianData(req.body); // This variable validationResult is equal to the return value of the validateMusicianData.  req.body is the input and returns a val result object
    if (!validationResult.isValid) {
      // If it does not the same it will send an 400 bad request
      return res.status(400).json({
        success: false, // Json response
        message: "Validation failed", // Message user will see
        errors: validationResult.errors, // sends the error to the validation result
      });
    }

    // Insert into database   I am destructuring req.body into individual variables.
    const {
      name,
      bio,
      location,
      instruments,
      genres,
      experience_level,
      years_experience,
      available_for_gigs = true, // The true and false are default values for these two lines
      looking_for_band = false,
      profile_photo_url,
    } = req.body; // This is extracting all of the properties from req.body

    // If there is no existing we create a newProfile into the database using the above properties
    const newProfile = await pool.query(
      // Await pauses this function until database operation completes.  it waits for promise to resolve before going to next line..  using pool.query to add following into database
      `INSERT INTO  musician_profiles
            (user_id, name, bio, location, instruments, genres, experience_level, years_experience, available_for_gigs, looking_for_band, profile_photo_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`, // This inserts all of the properties into musician_profiles in the database.  user_id to prof. url are properties, THe $1 are placeholer/parameters and it is returning the newly created row
      [
        req.session.userId,
        name,
        bio || null,
        location,
        JSON.stringify(instruments), // JSON.strinfiy turns the values into strings
        JSON.stringify(genres) || null, // || if this value is falsty (empty, undefined) use null instead.
        experience_level,
        years_experience || null,
        available_for_gigs,
        looking_for_band,
        profile_photo_url || null,
      ] // These are the properites
    );

    // Send Response   THis is what is pushed if everything is successful
    res.status(201).json({
      // 201 means "Created".  THis is used when something new has been successfully created.
      success: true,
      message: "Musician profile created successfully",
      profile: {
        // the properties were already inthe database.  Now i am taking properites FROM the database result and putting them into the response to send back to the client.
        id: newProfile.rows[0].id, //  They create new rows starting at [0] which is the first and should be only.
        user_id: newProfile.rows[0].user_id,
        name: newProfile.rows[0].name,
        bio: newProfile.rows[0].bio,
        location: newProfile.rows[0].location,
        instruments: JSON.parse(newProfile.rows[0].instruments), // JSON.parse converts a JSON string back into a JavaScript object/array.
        // For the next line.   This is a saftey check to avoid trying to parse null or undefined values which would cause an error
        genres: newProfile.rows[0].genres
          ? JSON.parse(newProfile.rows[0].genres)
          : null, // If generes exist and is truthy, parse it from JSON.  If its null/empty.  Return as null.
        experience_level: newProfile.rows[0].experience_level,
        years_experience: newProfile.rows[0].years_experience,
        available_for_gigs: newProfile.rows[0].available_for_gigs,
        looking_for_band: newProfile.rows[0].looking_for_band,
        created_at: newProfile.rows[0].created_at,
      },
    });
  } catch (error) {
    // Handle Errors   This happens if any errors happen during the try block
    console.error("Error creating musician profile:", error); // this sends the error to the conse.  calling this message and following it with the actual error
    res.status(500).json({
      // 500 is a internal Server Error. used when something goes wrong on server side that the client couldn't prevent
      success: false, // false means it was not successful
      message: "Internal server error while creating profile",
      error: error.message, // error.message goes to the client in the JSON response
    });
  }
};

const createVenueProfile = async (req, res) => {
  try {
    const existingProfile = await pool.query(
      "SELECT id FROM venue_profiles WHERE user_id = $1",
      [req.session.userId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already has a venue profile",
      });
    }

    // Validate data
    const validationResult = validateVenueData(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.errors,
      });
    }

    const {
      business_name,
      bio,
      location,
      venue_type,
      capacity,
      contact_person,
      phone_number,
      website_url,
    } = req.body;

    const newProfile = await pool.query(
      `INSERT INTO venue_profiles 
    (user_id, business_name, bio, location, venue_type, capacity, contact_person, phone_number, website_url) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
      [
        req.session.userId,
        business_name,
        bio || null,
        location,
        venue_type,
        capacity,
        contact_person || null,
        phone_number || null,
        website_url || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Venue profile created successfully",
      profile: {
        id: newProfile.rows[0].id,
        user_id: newProfile.rows[0].user_id,
        business_name: newProfile.rows[0].business_name,
        bio: newProfile.rows[0].bio,
        location: newProfile.rows[0].location,
        venue_type: newProfile.rows[0].venue_type,
        capacity: newProfile.rows[0].capacity,
        contact_person: newProfile.rows[0].contact_person,
        phone_number: newProfile.rows[0].phone_number,
        website_url: newProfile.rows[0].website_url,
        created_at: newProfile.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("Error creating venue profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating profile",
      error: error.message,
    });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const currentUser = await pool.query("SELECT role FROM users WHERE id=$1", [
      req.session.userId,
    ]);

    // Check if user exists (should exist if logged in)
    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userRole = user.rows[0].role; // musician or venue

    // Query the correct profile table based on role
    let profileQuery;
    let profileTable;

    if (userRole === "musician") {
      profileTable = "musician_profiles";
      profileQuery = `
        SELECT * FROM musician_profiles WHERE user_id = $1`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // Execute the profile query
    const profileResult = await pool.query(profileQuery, [req.session.userId]);

    // Check if profile exists
    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${userRole} profile found. Please create your profile first.`,
        userRole: userRole,
      });
    }

    //  Return the profile data
    const profile = profileResult.rows[0];

    // Handle JSON fields for musicians (instruments, genres)
    if (userRole === "musician") {
      profile.instruments = JSON.parse(profile.instruments);
      if (profile.genres) {
        profile.genres = JSON.parse(profile.genres);
      }
    }

    // Send response
    res.json({
      success: true,
      userRole: userRole,
      profile: profile,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Routes
router.post("/musician", requireAuth, createMusicianProfile);
router.post("/venue", requireAuth, createVenueProfile);
router.get("/me", requireAuth, getCurrentUserProfile);
router.put("/me", requireAuth, updateCurrentUserProfile);
router.get("/:id", getPublicProfile);

module.exports = router;
