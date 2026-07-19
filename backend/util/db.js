const Sequelize = require("sequelize");
const { DATABASE_URL, TEST_DATABASE_URL } = require("./config");

const useTestDb = String(process.env.TESTING).toLowerCase() === "true";

const sequelize = new Sequelize(
  useTestDb ? TEST_DATABASE_URL : DATABASE_URL,
  useTestDb
    ? {}
    : {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        define: {
          schema: "public",
        },
      },
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to the database");
  } catch (err) {
    console.log("failed to connect to the database");
    console.log(err);
    return process.exit(1);
  }
};

module.exports = { connectToDatabase, sequelize };
