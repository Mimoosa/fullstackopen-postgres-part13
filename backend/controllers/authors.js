const router = require("express").Router();
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    group: ["author"],
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "blogs"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    order: [["likes", "DESC"]],
  });
  console.log(JSON.stringify(authors, null, 2));
  res.status(200).json(authors);
});

module.exports = router;
