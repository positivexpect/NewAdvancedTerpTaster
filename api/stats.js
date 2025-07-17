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
    const [totalReviews, avgScore, topStrains, topReviewers, reviewsByMonth] =
      await Promise.all([
        pool.query("SELECT COUNT(*) as total FROM weed_reviews"),
        pool.query(
          "SELECT ROUND(AVG(overall_score), 2) as avg_score FROM weed_reviews",
        ),
        pool.query(`
        SELECT strain, COUNT(*) as review_count, ROUND(AVG(overall_score), 2) as avg_score
        FROM weed_reviews
        GROUP BY strain
        ORDER BY review_count DESC, avg_score DESC
        LIMIT 10
      `),
        pool.query(`
        SELECT reviewed_by, COUNT(*) as review_count
        FROM weed_reviews
        GROUP BY reviewed_by
        ORDER BY review_count DESC
        LIMIT 10
      `),
        pool.query(`
        SELECT DATE_TRUNC('month', review_date) as month, COUNT(*) as reviews
        FROM weed_reviews
        WHERE review_date >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', review_date)
        ORDER BY month DESC
      `),
      ]);

    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json({
      totalReviews: parseInt(totalReviews.rows[0].total),
      averageScore: parseFloat(avgScore.rows[0].avg_score) || 0,
      topStrains: topStrains.rows,
      topReviewers: topReviewers.rows,
      reviewsByMonth: reviewsByMonth.rows,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: error.message });
  }
}
