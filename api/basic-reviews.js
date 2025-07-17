const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { strain, location, overall_score, notes, reviewed_by, photos } =
      req.body;

    if (!strain || !location || !reviewed_by || !overall_score) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const insertQuery = `
      INSERT INTO weed_reviews (strain, location, overall_score, notes, reviewed_by, photos, review_date)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE) RETURNING *;
    `;

    const values = [
      strain,
      location,
      parseFloat(overall_score),
      notes,
      reviewed_by,
      photos || [],
    ];

    const result = await pool.query(insertQuery, values);
    res.status(201).json({
      message: "Basic Review submitted!",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Basic Review Error:", error);
    res.status(500).json({ error: error.message });
  }
}
