import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ======================================================
// CLOUDINARY UPLOAD
// ======================================================

export const uploadToCloudinary = (
  buffer,
  folder = "trestep/products"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },

        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary upload error:",
              error
            );

            reject(error);
            return;
          }

          resolve(result.secure_url);
        }
      );

    uploadStream.end(buffer);
  });
};

// ======================================================
// PRODUCT IMAGES
// ======================================================

export const uploadProductImages =
  upload.array("images", 10);

// ======================================================
// CATEGORY IMAGE
// ======================================================

export const uploadCategoryImage =
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },

    {
      name: "subCategoryImage",
      maxCount: 1,
    },
  ]);

// ======================================================
// DEFAULT
// ======================================================

export default upload;