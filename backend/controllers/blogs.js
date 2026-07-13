const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

app.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

app.post("/", async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.get("/:id", blogFinder, async (req, res) => {
  console.log(blog.toJSON());
  res.json(req.blog);
});

app.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

app.delete("/:id", async (req, res) => {
  await req.blog.destroy();
  res.status(204).end();
});

module.exports = router;
