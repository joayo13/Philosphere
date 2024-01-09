var express = require('express');
var router = express.Router();
const story_controller = require("../controllers/storyController");

router.get('/story-form', story_controller.storyform_get)
router.post('/story-form', story_controller.storyform_post)
router.get('/:id', story_controller.story_get)
router.post('/:id', story_controller.story_post_vote)

module.exports = router;