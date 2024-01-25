const express = require('express');
const router = express.Router();

// Controllers
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");


/* GET home page. */
router.get('/', message_controller.display_messages);

// GET request for creating a message
router.get('/newmessage', message_controller.new_message_get);

// POST request for creating a message
router.post('/newmessage', message_controller.new_message_post);

// POST request for deleting a message
router.post('/delete-message/:id', message_controller.message_delete_post);


// GET request for creating an user
router.get('/signup', user_controller.signup_get);

// POST request for creating an user
router.post('/signup', user_controller.signup_post);

// GET request for login an user
router.get('/login', user_controller.login_get);

// POST request for login an user
router.post('/login', user_controller.login_post);

// GET for logging out
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// GET request for join admin
router.get("/join_club", user_controller.join_club_get);

// POST request for join club
router.post("/join_club", user_controller.join_club_post);

// GET request for join admin
router.get("/join_admin", user_controller.join_admin_get);

// POST request for join admin
router.post("/join_admin", user_controller.join_admin_post);



module.exports = router;
