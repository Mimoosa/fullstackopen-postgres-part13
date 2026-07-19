const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const readingListRouter = require("./controllers/readingLists");
const logoutRouter = require("./controllers/logout");

const { User, Blog, Session, ReadingList } = require("./models");

const { errorHandler } = require("./util/middleware");

const { sequelize } = require("./util/db");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", readingListRouter);
app.use("/api/logout", logoutRouter);

app.post("/api/reset", async (req, res) => {
  const qi = sequelize.getQueryInterface();

  await qi.bulkDelete("reading_lists", {});
  await qi.bulkDelete("sessions", {});
  await qi.bulkDelete("blogs", {});
  await qi.bulkDelete("users", {});

  res.status(204).end();
});

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();

  if (process.env.TESTING === "true") {
    const { sequelize } = require("./util/db");
    await sequelize.sync({ force: true });
    console.log("Test DB synced (tables created)");
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
