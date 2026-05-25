const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middlewares/authMiddleware");

// All blog routes are protected (require JWT token)
router.use(protect);

// POST   /api/blogs       — Create a new blog
router.post("/", createBlog);

// GET    /api/blogs       — Read all blogs (with pagination)
router.get("/", getAllBlogs);

// GET    /api/blogs/:id   — Read single blog
router.get("/:id", getBlogById);

// PUT    /api/blogs/:id   — Edit a blog (author only)
router.put("/:id", updateBlog);

// DELETE /api/blogs/:id   — Delete a blog (author only)
router.delete("/:id", deleteBlog);

module.exports = router;
