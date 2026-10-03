import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

// ======================================================
// CREATE SLUG
// ======================================================

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ======================================================
// CREATE UNIQUE SLUG
// ======================================================

const createUniqueSlug = async (
  title,
  currentId = null
) => {
  const baseSlug = createSlug(title);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      slug,
    };

    if (currentId) {
      query._id = {
        $ne: currentId,
      };
    }

    const existingBlog =
      await Blog.findOne(query);

    if (!existingBlog) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// ======================================================
// CREATE BLOG
// ======================================================

export const createBlog = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      author,
      isPublished,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Blog title is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Blog category is required",
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Blog content is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Blog image is required",
      });
    }

    const slug =
      await createUniqueSlug(title);

    const image =
      await uploadToCloudinary(
        req.file.buffer,
        "trestep/blogs"
      );

    const blog =
      await Blog.create({
        title: title.trim(),

        slug,

        category: category.trim(),

        excerpt:
          excerpt?.trim() || "",

        content: content.trim(),

        image,

        author:
          author?.trim() || "Trestep",

        isPublished:
          isPublished !== undefined
            ? isPublished === "true" ||
              isPublished === true
            : true,
      });

    return res.status(201).json({
      success: true,
      message:
        "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(
      "Create blog error:",
      error
    );

    next(error);
  }
};

// ======================================================
// GET ALL PUBLISHED BLOGS
// ======================================================

export const getBlogs = async (
  req,
  res,
  next
) => {
  try {
    const blogs =
      await Blog.find({
        isPublished: true,
      }).sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(
      "Get blogs error:",
      error
    );

    next(error);
  }
};

// ======================================================
// GET SINGLE BLOG
// ======================================================

export const getBlogById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------
    // VALIDATE MONGODB ID
    // --------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid blog ID",
      });
    }

    const blog =
      await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message:
          "Blog not found",
      });
    }

    // --------------------------------------------------
    // RETURN BLOG
    // --------------------------------------------------

    return res.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(
      "Get blog by id error:",
      error
    );

    next(error);
  }
};

// ======================================================
// UPDATE BLOG
// ======================================================

export const updateBlog = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid blog ID",
      });
    }

    const blog =
      await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message:
          "Blog not found",
      });
    }

    const {
      title,
      category,
      excerpt,
      content,
      author,
      isPublished,
    } = req.body;

    // --------------------------------------------------
    // TITLE
    // --------------------------------------------------

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Blog title is required",
        });
      }

      blog.title =
        title.trim();

      blog.slug =
        await createUniqueSlug(
          title,
          blog._id
        );
    }

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Blog category is required",
        });
      }

      blog.category =
        category.trim();
    }

    // --------------------------------------------------
    // EXCERPT
    // --------------------------------------------------

    if (excerpt !== undefined) {
      blog.excerpt =
        excerpt.trim();
    }

    // --------------------------------------------------
    // CONTENT
    // --------------------------------------------------

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Blog content is required",
        });
      }

      blog.content =
        content.trim();
    }

    // --------------------------------------------------
    // AUTHOR
    // --------------------------------------------------

    if (author !== undefined) {
      blog.author =
        author.trim() ||
        "Trestep";
    }

    // --------------------------------------------------
    // PUBLISHED STATUS
    // --------------------------------------------------

    if (isPublished !== undefined) {
      blog.isPublished =
        isPublished === "true" ||
        isPublished === true;
    }

    // --------------------------------------------------
    // NEW IMAGE
    // --------------------------------------------------

    if (req.file) {
      const image =
        await uploadToCloudinary(
          req.file.buffer,
          "trestep/blogs"
        );

      blog.image = image;
    }

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------

    await blog.save();

    return res.json({
      success: true,
      message:
        "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error(
      "Update blog error:",
      error
    );

    next(error);
  }
};

// ======================================================
// DELETE BLOG
// ======================================================

export const deleteBlog = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid blog ID",
      });
    }

    const blog =
      await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message:
          "Blog not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Blog deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete blog error:",
      error
    );

    next(error);
  }
};