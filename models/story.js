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
    required: true
  },
  releaseDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  plotSummary: {
    type: String,
    minLength: 20,
    maxLength: 200,
    required: true
  },
  story: {
    minLength: 20,
    maxLength: 100000,
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  ratingAmount: {
    type: Number,
    required: true
  }, 
});

// Create a model based on the schema
const Story = mongoose.model('Story', storySchema);

module.exports = Story;