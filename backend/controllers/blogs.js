const router = require("express").Router();
const { Op } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

const { Blog, User, Session } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const where = {};
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ];
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.status(200).json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const session = await Session.findOne({ where: { token: req.token } });
    if (!session) {
      return response.status(401).json({
        error: "invalid token",
      });
    }
    const user = await User.findOne({ where: { id: session.userId } });
    if (user && user.disabled) {
      return response.status(403).json({
        error: "user is disabled.",
      });
    }

    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", blogFinder, async (req, res) => {
  console.log(req.blog.toJSON());
  res.status(200).json(req.blog);
});

router.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  const session = await Session.findOne({ where: { token: req.token } });
  if (!session) {
    return response.status(401).json({
      error: "invalid token",
    });
  }
  const user = await User.findOne({ where: { id: session.userId } });
  if (user && user.disabled) {
    return response.status(403).json({
      error: "user is disabled.",
    });
  }

  if (req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy();
    res.status(204).end();
  }
});

module.exports = router;
