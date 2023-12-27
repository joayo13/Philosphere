const mongoose = require('mongoose');

// Define the schema for a story
const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  releaseDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  story: {
    minLength: 1,
    maxLength: 100000,
    type: String,
    required: true
  },
  ratings: [
    {
      rating: {
        type: Number,
        max: 1,
        min: 0,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  ],
});

// Create a model based on the schema
const Story = mongoose.model('Story', storySchema);

module.exports = Story;