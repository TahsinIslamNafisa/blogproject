const Blog = require("../models/Blog");

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    const blog = await Blog.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
    });

    await blog.populate("author", "name email");

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data: blog,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully.",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Private
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid blog ID." });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private (only author)
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    // Only the author can edit the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own blogs.",
      });
    }

    const { title, content, tags } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (tags !== undefined) blog.tags = tags;

    const updatedBlog = await blog.save();
    await updatedBlog.populate("author", "name email");

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      data: updatedBlog,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid blog ID." });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (only author)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    // Only the author can delete the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own blogs.",
      });
    }

    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid blog ID." });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
