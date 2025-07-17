const { Pool } = require("pg");

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT * FROM weed_reviews ORDER BY review_date DESC",
      );
      return res.json(result.rows);
    }

    if (req.method === "POST") {
      const { strain, location, overall_score, notes, reviewed_by } = req.body;

      if (!strain || !location || !reviewed_by || !overall_score) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const insertQuery = `
        INSERT INTO weed_reviews (strain, location, overall_score, notes, reviewed_by, review_date)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *;
      `;

      const values = [
        strain,
        location,
        parseFloat(overall_score),
        notes,
        reviewed_by,
      ];
      const result = await pool.query(insertQuery, values);

      return res.status(201).json({
        message: "Review submitted!",
        review: result.rows[0],
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
