// const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const historyLogRoutes = require("./routes/historyLog");
const authRoutes = require("./routes/auth");

const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://7h3blu3:73XBU9fI69AV8jTk@cluster0.dm69koz.mongodb.net/assessment?retryWrites=true&w=majority'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log("Connected to database!");
  })
  .catch(err => {
    console.log(err + " Connection to database failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  next();
});


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/admin', adminRoutes, historyLogRoutes);
app.use("", userRoutes, authRoutes) 

// When its not working try like this
// app.get("/list-users", getListUsers = (async (req, res, next) => {
//   try {
//     const users = await User.find()
//     console.log(users)
// (200).json({
//       message: "Listing users successfully",
//       user: users,
//     })
//   } catch(e){
//     console.log(e)
//     res.status(500).json({
//       message: "Create scenario render failed"
//     })
//   }  
// }))



module.exports = app;