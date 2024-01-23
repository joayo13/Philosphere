const Story = require("../models/story");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
exports.storyform_get = (req, res) => {
    if(req.isAuthenticated()) {
      res.render('story-form');
    }
    else {
      res.redirect('/signin')
    }
  };
  const sanitizeAndValidate = [
    body('title').trim().isLength({ min: 1 }).escape(),
  ];
  exports.storyform_post = [ sanitizeAndValidate, async (req, res) => {
    console.log(req.user)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    // Create a new post using the data from the request body
    const newStory = new Story({
      title: req.body.title,
      author: new mongoose.Types.ObjectId(req.user.id),
      releaseDate: Date.now(),
      story: req.body.content,
      ratings: [{
        rating: 1,
        userId: new mongoose.Types.ObjectId(req.user.id),
        }]
    });
  
    // Save the new post to the database
    newStory.save();
    res.redirect(`/story/${newStory.id}`)
  }]

  exports.story_get = asyncHandler( async (req, res) => {
    const storyData = await Story.findById(req.params.id).populate("author").exec()
    const positiveReviews = storyData.ratings.filter((rating) => rating.rating === 1).length
    const negativeReviews  = storyData.ratings.filter((rating) => rating.rating === 0).length
    const totalReviews = positiveReviews + negativeReviews
    const totalRating =  Math.floor(100 / totalReviews * positiveReviews)
    res.render('story', {
      story: storyData,
      totalRating: totalRating,
      totalReviews: totalReviews
    })

  })

  exports.story_post_vote =  asyncHandler( async (req, res, next) => {
    if(req.isAuthenticated) {
      
      if(req.body.upvote === '') {
        const storyDataNew = {
          rating: 1,
          userId: req.user.id
        }
        const storyData = await Story.findOneAndUpdate({_id: req.params.id}, {$addToSet: {ratings: storyDataNew}})
      }
      if(req.body.downvote === '') {
        const storyDataNew = {
          rating: 0,
          userId: req.user.id
        }
        const storyData = await Story.findOneAndUpdate({_id: req.params.id}, {$addToSet: {ratings: storyDataNew}})
      
      }

    }
    res.redirect(`/story/${req.params.id}`)
  })