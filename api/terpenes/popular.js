import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
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
    const result = await pool.query(`
      SELECT
        terpene,
        COUNT(*) as frequency,
        ROUND(AVG(overall_score), 2) as avg_score
      FROM (
        SELECT unnest(known_terps) as terpene, overall_score
        FROM weed_reviews
        WHERE known_terps IS NOT NULL
        UNION ALL
        SELECT unnest(terpenes) as terpene, overall_score
        FROM weed_reviews
        WHERE terpenes IS NOT NULL
      ) as terpene_data
      WHERE terpene IS NOT NULL AND terpene != ''
      GROUP BY terpene
      ORDER BY frequency DESC, avg_score DESC
      LIMIT 20
    `);

    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json(result.rows);
  } catch (error) {
    console.error("Terpenes stats error:", error);
    res.status(500).json({ error: error.message });
  }
}
