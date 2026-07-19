const router = require("express").Router();

const User = require("../models/user");
const Blog = require("../models/blog");
const ReadingList = require("../models/readingList");
const Session = require("../models/session");

const { tokenExtractor } = require("../util/middleware");

router.post("/", async (request, response) => {
  const { blogId, userId } = request.body;

  if (!blogId || !userId) {
    return response.status(400).json({ error: "blogId and userId required" });
  }

  const user = await User.findByPk(Number(userId));
  const blog = await Blog.findByPk(Number(blogId));

  if (!(user && blog)) {
    return response.status(404).json({
      error: "invalid user-id or blog-id",
    });
  }

  try {
    const readingList = await ReadingList.create({
      userId: Number(userId),
      blogId: Number(blogId),
      read: false,
    });

    const saved = await ReadingList.findByPk(readingList.id);

    response.status(201).json({
      id: saved.id,
      userId: saved.userId,
      blogId: saved.blogId,
      read: saved.read,
    });
  } catch (error) {
    return response.status(400).json({ error });
  }
});

router.put("/:id", tokenExtractor, async (req, res) => {
  try {
    const session = await Session.findOne({ where: { token: req.token } });
    if (!session) {
      return res.status(401).json({
        error: "invalid token",
      });
    }
    const user = await User.findOne({ where: { id: session.userId } });
    if (user && user.disabled) {
      return res.status(403).json({
        error: "user is disabled.",
      });
    }
    const readingList = await ReadingList.findByPk(req.params.id);
    if (!readingList) {
      return res.status(404).json({ error: "reading list entry not found" });
    }

    if (readingList.userId !== session.userId) {
      return res.status(403).json({ error: "forbidden" });
    }

    readingList.read = req.body.read;
    await readingList.save();

    const blog = await Blog.findByPk(readingList.blogId);

    return res.json({
      id: readingList.id,
      userId: readingList.userId,
      blogId: readingList.blogId,
      read: readingList.read,
      blog: {
        id: blog.id,
        author: blog.author,
        url: blog.url,
        title: blog.title,
        likes: blog.likes,
        year: blog.year,
      },
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
