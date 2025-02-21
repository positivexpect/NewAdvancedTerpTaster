require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json()); // Allows JSON requests

// Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// ✅ PostgreSQL Database Connection with Error Handling
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

pool.connect()
    .then(() => console.log("✅ Database connected successfully!"))
    .catch(err => {
        console.error("❌ Database connection failed!", err.stack);
        process.exit(1); // Stop the server if DB fails to connect
    });

// ✅ Root Route - API Welcome Message
app.get("/", (req, res) => {
    res.json({ message: "🔥 Weed Review API is running!" });
});

// ✅ GET all reviews
app.get("/reviews", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM weed_reviews ORDER BY review_date DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching reviews:", error.stack);
        res.status(500).json({ error: error.message });
    }
});

// ✅ GET a single review by ID
app.get("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM weed_reviews WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error fetching review:", error.stack);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Search reviews (by strain, terpenes, etc.)
app.get("/search", async (req, res) => {
    try {
        const { strain } = req.query;
        if (!strain) {
            return res.status(400).json({ error: "Strain query parameter is required" });
        }

        console.log("🔍 Search query received:", strain);

        const result = await pool.query(
            "SELECT * FROM weed_reviews WHERE LOWER(strain) LIKE LOWER($1) ORDER BY review_date DESC",
            [`%${strain}%`]
        );

        console.log("🔎 Search results:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Search error:", error.stack);
        res.status(500).json({ error: error.message });
    }
});

// Add validation to POST endpoints
app.post("/reviews", async (req, res) => {
  try {
    console.log("📩 Received Review Data:", req.body);
    console.log("Required fields check:", {
      strain: !!req.body.strain,
      location: !!req.body.location,
      overall_score: !!req.body.overall_score,
      reviewed_by: !!req.body.reviewed_by
    });

    const { strain, location, overall_score, notes, reviewed_by } = req.body;

    // Ensure required fields are present
    if (!strain || !location || !reviewed_by || !overall_score) {
      console.log("Missing fields:", {
        strain: !strain,
        location: !location,
        reviewed_by: !reviewed_by,
        overall_score: !overall_score
      });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Build query dynamically based on what fields are actually present
    const fields = [];
    const values = [];
    const placeholders = [];
    let paramCount = 1;

    // Helper function to add a field if it exists
    const addField = (fieldName, columnName, value, type = '') => {
      if (value !== undefined && value !== null) {
        fields.push(columnName);
        values.push(value);
        placeholders.push(`$${paramCount}${type}`);
        paramCount++;
      }
    };

    // Add all fields matching your database columns
    addField('type', 'type', req.body.type);
    addField('grower', 'grower', req.body.grower);
    addField('location', 'location', location);
    addField('strain', 'strain', strain);
    addField('smokingInstrument', 'smoking_instrument', req.body.smokingInstrument);
    addField('tasteRating', 'taste_rating', req.body.tasteRating);
    addField('smell', 'smell', req.body.smell);
    addField('smellRating', 'smell_rating', req.body.smellRating);
    addField('bagAppeal', 'bag_appeal', req.body.bagAppeal);
    addField('bagAppealRating', 'bag_appeal_rating', req.body.bagAppealRating);
    addField('breakStyle', 'break_style', req.body.breakStyle);
    addField('thc', 'thc', req.body.thc);
    addField('knownTerps', 'known_terps', req.body.knownTerps, '::text[]');
    addField('notes', 'notes', notes);
    addField('reviewedBy', 'reviewed_by', reviewed_by);
    addField('terpsPercent', 'terps_percent', req.body.terpsPercent);
    addField('reviewDate', 'review_date', req.body.reviewDate);
    addField('secondTimeConsistency', 'second_time_consistency', req.body.secondTimeConsistency);
    addField('grandChamp', 'grand_champ', req.body.grandChamp);
    addField('high', 'high', req.body.high);
    addField('highRating', 'high_rating', req.body.highRating);
    addField('overallScore', 'overall_score', overall_score);
    addField('chestPunch', 'chest_punch', req.body.chestPunch);
    addField('throatHitter', 'throat_hitter', req.body.throatHitter);
    addField('headFeel', 'head_feel', req.body.headFeel);
    addField('bodyFeel', 'body_feel', req.body.bodyFeel);
    addField('exhaleTerps', 'exhale_terps', req.body.exhaleTerps, '::text[]');
    addField('flowerColor', 'flower_color', req.body.flowerColor, '::text[]');
    addField('growStyle', 'grow_style', req.body.growStyle, '::text[]');
    addField('inhaleTerps', 'inhale_terps', req.body.inhaleTerps, '::text[]');
    addField('weedType', 'weed_type', req.body.weedType);
    addField('smokingDevice', 'smoking_device', req.body.smokingDevice);
    addField('terpenes', 'terpenes', req.body.terpenes, '::text[]');
    addField('terpenePercent', 'terpene_percent', req.body.terpenePercent);
    addField('looks', 'looks', req.body.looks);
    addField('taste', 'taste', req.body.taste);
    addField('previousRating', 'previous_rating', req.body.previousRating);

    // Build and execute query
    const insertQuery = `
      INSERT INTO weed_reviews (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *;
    `;

    console.log("Executing query:", insertQuery);
    console.log("With values:", values);

    const result = await pool.query(insertQuery, values);
    res.status(201).json({ message: "✅ Master Review submitted!", review: result.rows[0] });

  } catch (err) {
    console.error("❌ Master Review Insert Error:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST a Basic Review (New Endpoint)
app.post("/basic-reviews", async (req, res) => {
    try {
        console.log("📩 Received Basic Review Data:", req.body);

        const { strain, location, overall_score, notes, reviewed_by } = req.body;

        // Ensure required fields are present
        if (!strain || !location || !reviewed_by || !overall_score) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const insertQuery = `
            INSERT INTO weed_reviews (strain, location, overall_score, notes, reviewed_by, review_date)
            VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *;
        `;

        const values = [strain, location, parseFloat(overall_score), notes, reviewed_by];

        const result = await pool.query(insertQuery, values);
        res.status(201).json({ message: "Basic Review submitted!", review: result.rows[0] });

    } catch (err) {
        console.error("🔥 Basic Review Insert Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE a review
app.delete("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteResult = await pool.query("DELETE FROM weed_reviews WHERE id = $1 RETURNING *", [id]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.json({ message: "🗑️ Review deleted successfully", deletedReview: deleteResult.rows[0] });
    } catch (error) {
        console.error("❌ Error deleting review:", error.stack);
        res.status(500).json({ error: error.message });
    }
});

// Add this logging to see what's being received
app.post('/api/reviews', (req, res) => {
  console.log('Received data:', req.body);
  
  // Check required fields
  const requiredFields = [
    'strain',
    'type',
    'grower',
    'location',
    'reviewed_by',
    'review_date'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log('Missing fields:', missingFields);
    return res.status(400).json({ 
      error: 'Missing required fields',
      missingFields 
    });
  }
  // ... rest of the handler
});

// ✅ Start the server on port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
