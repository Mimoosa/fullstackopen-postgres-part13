const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const { User, Blog } = require("./models");
const { syncModels } = require("./models");

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return response
      .status(400)
      .json({ error: error.errors.map((e) => e.message) });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return response
      .status(400)
      .json({ error: error.errors.map((e) => e.message) });
  }

  next(error);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  await syncModels();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
