const { successResponse, errorResponse } = require("../utils/response.util");

// Temporary database (array) - পরে MongoDB দিয়ে replace হবে
const blogs = [];

// Create Blog
const createBlog = (req, res) => {
  try {
    const { title, content } = req.body;

    const newBlog = {
      id: blogs.length + 1,
      title,
      content,
      author: req.user.email,
      createdAt: new Date(),
    };

    blogs.push(newBlog);

    return successResponse(res, 201, "Blog created successfully", newBlog);
  } catch (error) {
    return errorResponse(res, 500, "Blog creation failed", error.message);
  }
};

// Read All Blogs
const getAllBlogs = (req, res) => {
  try {
    return successResponse(res, 200, "All blogs fetched successfully", blogs);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch blogs", error.message);
  }
};

// Edit Blog
const editBlog = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = blogs.find((blog) => blog.id === parseInt(id));
    if (!blog) {
      return errorResponse(res, 404, "Blog not found.");
    }

    // শুধু নিজের blog edit করতে পারবে
    if (blog.author !== req.user.email) {
      return errorResponse(res, 403, "You can only edit your own blog.");
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    return successResponse(res, 200, "Blog updated successfully", blog);
  } catch (error) {
    return errorResponse(res, 500, "Blog update failed", error.message);
  }
};

// Delete Blog
const deleteBlog = (req, res) => {
  try {
    const { id } = req.params;

    const blogIndex = blogs.findIndex((blog) => blog.id === parseInt(id));
    if (blogIndex === -1) {
      return errorResponse(res, 404, "Blog not found.");
    }

    // শুধু নিজের blog delete করতে পারবে
    if (blogs[blogIndex].author !== req.user.email) {
      return errorResponse(res, 403, "You can only delete your own blog.");
    }

    blogs.splice(blogIndex, 1);

    return successResponse(res, 200, "Blog deleted successfully");
  } catch (error) {
    return errorResponse(res, 500, "Blog deletion failed", error.message);
  }
};

module.exports = { createBlog, getAllBlogs, editBlog, deleteBlog };