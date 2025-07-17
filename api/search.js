const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      strain,
      location,
      reviewer,
      terpene,
      minScore,
      maxScore,
      limit = 50,
    } = req.query;

    if (!strain && !location && !reviewer && !terpene) {
      return res.status(400).json({
        error:
          "At least one search parameter is required (strain, location, reviewer, or terpene)",
      });
    }

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (strain) {
      whereConditions.push(`LOWER(strain) LIKE LOWER($${paramCount})`);
      queryParams.push(`%${strain}%`);
      paramCount++;
    }

    if (location) {
      whereConditions.push(`LOWER(location) LIKE LOWER($${paramCount})`);
      queryParams.push(`%${location}%`);
      paramCount++;
    }

    if (reviewer) {
      whereConditions.push(`LOWER(reviewed_by) LIKE LOWER($${paramCount})`);
      queryParams.push(`%${reviewer}%`);
      paramCount++;
    }

    if (terpene) {
      whereConditions.push(`(
        LOWER(array_to_string(known_terps, ' ')) LIKE LOWER($${paramCount}) OR
        LOWER(array_to_string(terpenes, ' ')) LIKE LOWER($${paramCount}) OR
        LOWER(array_to_string(inhale_terps, ' ')) LIKE LOWER($${paramCount}) OR
        LOWER(array_to_string(exhale_terps, ' ')) LIKE LOWER($${paramCount})
      )`);
      queryParams.push(`%${terpene}%`);
      paramCount++;
    }

    if (minScore) {
      whereConditions.push(`overall_score >= $${paramCount}`);
      queryParams.push(parseFloat(minScore));
      paramCount++;
    }

    if (maxScore) {
      whereConditions.push(`overall_score <= $${paramCount}`);
      queryParams.push(parseFloat(maxScore));
      paramCount++;
    }

    const query = `
      SELECT * FROM weed_reviews
      WHERE ${whereConditions.join(" AND ")}
      ORDER BY review_date DESC, overall_score DESC
      LIMIT $${paramCount}
    `;
    queryParams.push(parseInt(limit));

    const result = await pool.query(query, queryParams);

    res.setHeader("Cache-Control", "public, max-age=300");
    res.json({
      results: result.rows,
      total: result.rows.length,
      searchParams: { strain, location, reviewer, terpene, minScore, maxScore },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: error.message });
  }
}
