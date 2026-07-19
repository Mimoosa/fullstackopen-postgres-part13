const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const { User, Blog } = require("./models");
const { sequelize } = require("./util/db");

const { errorHandler } = require("./util/middleware");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);

app.post("/api/reset", async (req, res) => {
  await Blog.destroy({
    where: {},
  });

  await User.destroy({
    where: {},
  });

  res.status(204).end();
});

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
