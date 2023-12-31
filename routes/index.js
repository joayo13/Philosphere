const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const passport = require('../passport-config'); // Adjust the path as needed
const User = require('../models/user'); // Assuming the path is correct
const Story = require('../models/story');
const mongoose = require('mongoose');
const { Schema, model, addToSet } = mongoose;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});
router.get('/signin', (req, res) => {
  res.render('signin');
});

const validateSignin = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
const validateSignup = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

// Handle signin form submission with async handler and validation
router.post('/signin', validateSignin, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('signin', { errors: errors.array() });
  }

  passport.authenticate('local', {
    successRedirect: `/`,
    failureRedirect: '/signin',
    failureFlash: true,
  })(req, res, next);
}));

router.get('/story-form', (req, res) => {
  if(req.isAuthenticated()) {
    res.render('story-form');
  }
  else {
    res.redirect('/signin')
  }
});
const sanitizeAndValidate = [
  body('title').trim().isLength({ min: 1 }).escape(),
];
router.post('/story-form', sanitizeAndValidate, async (req, res) => {
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

})
router.get('/signup', (req, res) => {
  res.render('signup');
});


// Handle signup form submission with async handler and validation
router.post('/signup', validateSignup, asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('signup', { errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Create a new user using the User model
    const newUser = new User({ username, email, password });

    // Save the new user to the database
    await newUser.save();

    console.log('User added to database');

    // Redirect to a success page or handle signup logic
    res.redirect('/signin', {
      message: "Account Created, Sign In to Continue"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
}));
  router.get('/story/:id', asyncHandler( async (req, res) => {
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

  }))

  router.post('/story/:id', asyncHandler( async (req, res, next) => {
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
  }))



module.exports = router;
