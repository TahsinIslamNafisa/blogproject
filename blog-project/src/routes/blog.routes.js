const router = require("express").Router();
const { createBlog, getAllBlogs, editBlog, deleteBlog } = require("../controllers/blog.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Token ছাড়া এই routes এ ঢোকা যাবে না
router.post("/create", authMiddleware, createBlog);
router.get("/all", authMiddleware, getAllBlogs);
router.put("/edit/:id", authMiddleware, editBlog);
router.delete("/delete/:id", authMiddleware, deleteBlog);

module.exports = router;