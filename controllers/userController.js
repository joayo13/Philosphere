const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all Authors.
exports.user_get = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = await User.find({_id: req.user.id}).exec()
    res.send(user)
  }
  else {
    res.redirect('/signin')
  }
});