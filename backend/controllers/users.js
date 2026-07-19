const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const { User, Blog, ReadingList } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ["passwordHash"],
    },
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "passwordHash", "createdAt", "updatedAt"] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
        through: {
          as: "reading_list",
          attributes: ["id", "read"],
          where: req.query.read ? { read: req.query.read } : undefined,
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, name, password } = req.body;
    if (password.length < 3) {
      return res
        .status(400)
        .json({ error: "A password must be at least 3 characters long." });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
