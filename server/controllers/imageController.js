
const supabase = require("../config/supabase");
const { randomUUID } = require("crypto");
const path = require("path");

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    const fileName = `products/${randomUUID()}${extension}`;

    const { error } = await supabase.storage
      .from("fashora-products")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      return res.status(500).json({
        message: "Image upload failed",
        error: error.message,
      });
    }

    const { data } = supabase.storage
      .from("fashora-products")
      .getPublicUrl(fileName);

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: data.publicUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return res.status(500).json({
      message: "Server error while uploading image",
    });
  }
};

module.exports = { uploadProductImage };
