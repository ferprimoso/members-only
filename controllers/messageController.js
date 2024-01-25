const User = require("../models/user");
const Message = require("../models/message");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require('passport');


exports.display_messages = asyncHandler(async (req, res, next) => {
  // Get details of message and users
  const messages = await Message.find().sort({ timestamp: -1}).populate("user").exec();

  console.log(messages)

  res.render("index", { title: "Home", messages: messages, user: req.user });
});

// Handle create message on GET
exports.new_message_get = (req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  }

  res.render("new_message_form", { user: req.user, errors: null, title: 'Post message' });
};

// Handle create message on POST

exports.new_message_post = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must be specified."),
  body("message")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Message must be specified."),

 
 // Process request after validation and sanitization.
 asyncHandler(async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a BookInstance object with escaped and trimmed data.
  const message = new Message({
    title: req.body.title,
    message: req.body.message,
    user: req.user.id,
  });

  if (!errors.isEmpty()) {
    // There are errors.
    // Render form again with sanitized values and error messages.

    res.render("new_message_form", {
      user: req.user,
      title: 'New Post',
      message: message,
      errors: errors.array(),
    });
    return;
  } else {
      // Data from form is valid
      await message.save();
      res.redirect('/');
    }
  }),  
];

// Handle delete message POST

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.redirect("/");
  }

  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

