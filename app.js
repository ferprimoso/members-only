const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const compression = require("compression");
const path = require('path');
const logger = require('morgan');
require('dotenv').config();

const indexRouter = require('./routes/index');

const User = require('./models/user')

// Mongoose Connection
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoDb = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDb);
}

// Start express
const app = express();

/*

  PASSPORT AUTHENTICATION

*/

require('./config/passport');


app.use(
  session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      maxAge: 86400 // 1 day
    },
    store: MongoStore.create({mongoUrl: mongoDb}),
  }));

  
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 40,
});
// Apply rate limiter to all requests
app.use(limiter);

//body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(compression());

//Loggin


//Routing
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
