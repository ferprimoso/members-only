const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require('passport');

// SIGNUP 

// Display User create form on GET.
exports.signup_get = (req, res, next) => {
  if (req.user) {
    res.redirect('/');
  }
  
  res.render("signup_form", { user: null, userform: null, errors: null, title: 'Sign up' });
};

// Handle User create on POST.
exports.signup_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Provide valid email")
    .custom(async (value) => {
      const user = await User.findOne({email: value});

      if (user) {
        throw new Error();
      }

      // If no user is found, the validation passes
      return true;
    })
    .withMessage("This email is already registered."),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Please make sure your passwords match."),

 // Process request after validation and sanitization.
 asyncHandler(async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a BookInstance object with escaped and trimmed data.
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  });

  if (!errors.isEmpty()) {
    // There are errors.
    // Render form again with sanitized values and error messages.

    res.render("signup_form", {
      title: 'Signup',
      user: null,
      userform: user,
      errors: errors.array(),
    });
    return;
  } else {
      // Data from form is valid
      await user.save();
      res.redirect('/login');
    }
  }),  
];

// LOGIN 

exports.login_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    res.redirect('/');
  }

  res.render("login_form", { user: null, userform: null, errors: null, title: 'Login' });
});


exports.login_post = [
  body('username').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
 
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("login_form", {
        user: req.user,
        userform: req.body.user,
        title: "Join Club",
        errors: errors.array(),
      });
      return;
    } else {
      // If validation passes, proceed with authentication
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Handle unexpected errors
      }

      if (!user) {
        // Authentication failed, display an error message
        res.render("login_form", {
          user: req.user,
          title: "Join Club",
          errors: [{ msg: 'Invalid email or password' }],
        });
      }

      // If authentication is successful, redirect to the home page
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.redirect('/');
      })
    })(req,res,next)
    }
  }),
];



// Join club form get

exports.join_club_get =  asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  }
  res.render("join_club", { user: req.user, errors: null, title: 'Join Club' });
});

// Join club form post

exports.join_club_post =  [
   // Validate and sanitize fields.
   body("secret")
   .trim()
   .escape()
   .custom((value) => value === process.env.MEMBER_PASSWORD)
   .withMessage("Wrong secret code."),
 

 // Process request after validation and sanitization.
 asyncHandler(async (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
     // There are errors. Render form again with sanitized values/errors messages.
     res.render("join_club", {
       user: req.user,
       title: "Join Club",
       errors: errors.array(),
     });
     return;
   } else {
     // Data from form is valid.

     // UPDATE.
     await User.findByIdAndUpdate(req.user.id, {membership_status: true});
     res.redirect('/');
   }
 }),
]

// Join club form get

exports.join_admin_get =  asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  }
  res.render("join_admin", { user: req.user, errors: null, title: 'Join Admin' });
});

// Join club form post

exports.join_admin_post =  [
   // Validate and sanitize fields.
   body("secret")
   .trim()
   .escape()
   .custom((value) => value === process.env.ADMIN_PASSWORD)
   .withMessage("Wrong secret code."),
 

 // Process request after validation and sanitization.
 asyncHandler(async (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
     // There are errors. Render form again with sanitized values/errors messages.
     res.render("join_admin", {
       user: req.user,
       title: "Join Admin",
       errors: errors.array(),
     });
     return;
   } else {
     // Data from form is valid.

     // UPDATE.
     await User.findOneAndUpdate({_id: req.user.id}, { $set: { admin: true } });
     res.redirect('/');
   }
 }),
]