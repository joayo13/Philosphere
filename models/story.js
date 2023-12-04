const mongoose = require('mongoose');

// Define the schema for a story
const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  plotSummary: {
    type: String,
    required: true
  },
});

// Create a model based on the schema
const Story = mongoose.model('Story', storySchema);

module.exports = Story;