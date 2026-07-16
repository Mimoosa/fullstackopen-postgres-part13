const User = require("./user");
const Blog = require("./blog");

User.hasMany(Blog);
Blog.belongsTo(User);

const syncModels = async () => {
  await User.sync();
  await Blog.sync();
};

module.exports = {
  Blog,
  User,
  syncModels,
};
