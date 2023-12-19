const Story = require("../models/story");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all Authors.
exports.user_get = asyncHandler(async (req, res, next) => {
  const userData = await User.findOne({_id: req.params.id}).exec();
  const userStoryData = await Story.find({author: req.params.id}).exec()
  if(userData) {
    console.log(req.user)
    res.render('user-page', {
      username: userData.username,
      storyData: userStoryData
    })
  }
    else {
      const err = "fuck you"
      return next(err)
    }
});