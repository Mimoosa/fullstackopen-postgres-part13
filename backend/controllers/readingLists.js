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
    return response.status(401).json({
      error: "invalid user-id or blog-id",
    });
  }

  try {
    const readingList = await ReadingList.create({
      userId: userId,
      blogId: blogId,
    });
    response.status(200).json(readingList);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id);
    readingList.read = req.body.read;
    await readingList.save();
    res.json(readingList);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
