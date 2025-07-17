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
    const { strain, location, overall_score, notes, reviewed_by, photos } = req.body;

    if (!strain || !location || !reviewed_by || !overall_score) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // For testing, just return the data without database
    res.status(201).json({
      message: "Basic Review submitted! (Test mode)",
      review: {
        strain,
        location,
        overall_score,
        notes,
        reviewed_by,
        photos: photos || [],
        review_date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Basic Review Error:", error);
    res.status(500).json({ error: error.message });
  }
}; 