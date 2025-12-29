import cloudinary from "../config/clodinary.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload buffer to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: "courses" }, // optional folder
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        return res.status(200).json({
          message: "File uploaded successfully",
          url: result.secure_url,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
