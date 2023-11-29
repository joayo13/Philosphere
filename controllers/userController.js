const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all Authors.
exports.user_list = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const allUsers = await User.find({}).exec()
    res.send(allUsers)
  }
  else {
    res.redirect('/signin')
  }
});