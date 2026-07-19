const router = require("express").Router();

const User = require("../models/user");
const Blog = require("../models/blog");
const ReadingList = require("../models/readingList");

router.post("/", async (request, response) => {
  const { blogId, userId } = request.body;

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  const blog = await Blog.findOne({
    where: {
      id: blogId,
    },
  });

  if (!(user && blog)) {
    return response.status(404).json({
      error: "invalid user-id or blog-id",
    });
  }

  try {
    const readingList = await ReadingList.create({
      userId: userId,
      blogId: blogId,
      read: false,
    });
    response.status(201).json({
      id: readingList.id,
      userId: readingList.userId,
      blogId: readingList.blogId,
      read: readingList.read,
    });
  } catch (error) {
    return response.status(400).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id);
    if (!readingList) {
      return res.status(404).json({ error: "reading list entry not found" });
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
