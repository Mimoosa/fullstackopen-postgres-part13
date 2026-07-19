const router = require("express").Router();
const { tokenExtractor } = require("../util/middleware");

const Session = require("../models/session");

router.delete("/", tokenExtractor, async (req, res) => {
  const session = await Session.findOne({ where: { token: req.token } });
  if (session) {
    await session.destroy();
    res.status(204).end();
  }
});

module.exports = router;
