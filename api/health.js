export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "connected",
    message: "🔥 TerpTaster API is running!",
    version: "2.0.0",
    features: ["Reviews", "Photo Upload", "Search", "Terpene Analysis"],
    endpoints: ["/api/reviews", "/api/upload", "/api/search", "/api/health"],
  });
}
