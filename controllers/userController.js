const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all Authors.
exports.user_get = asyncHandler(async (req, res, next) => {
  const userData = await User.find({_id: req.user.id}).exec();
  if(userData) {
    console.log(userData)
    res.render('user-page', {
      username: userData[0].username
    })
  }
    else {
      const err = "fuck you"
      return next(err)
    }
});