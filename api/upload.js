const { IncomingForm } = require("formidable");
const { v4: uuidv4 } = require("uuid");
const { put } = require("@vercel/blob");

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
    const form = new IncomingForm();
    form.maxFileSize = 5 * 1024 * 1024; // 5MB limit

    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    if (!files.photos || files.photos.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const processedFiles = [];
    const photosArray = Array.isArray(files.photos)
      ? files.photos
      : [files.photos];

    for (const file of photosArray) {
      const fileName = `${uuidv4()}.${file.originalFilename.split(".").pop()}`;

      // Upload to Vercel Blob Storage
      const blob = await put(fileName, file, {
        access: "public",
      });

      processedFiles.push({
        filename: fileName,
        originalName: file.originalFilename,
        url: blob.url,
        size: file.size,
      });
    }

    res.json({
      message: "Photos uploaded successfully!",
      files: processedFiles,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ error: "Failed to upload photos" });
  }
}
