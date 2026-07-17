const User = require("./user");
const Blog = require("./blog");

User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
};
