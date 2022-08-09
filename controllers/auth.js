const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Scenario = require("../models/scenario");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6e10fe391f6bd2",
    pass: "4745b00e704e6a"
  }
})

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

// Have to sent the data from the GET 
exports.getSignup = (async (req, res, next) => {
  const scenario = await Scenario.find()
    
  try {
      const allMissions = []
      const store = []

      scenario.forEach(element => allMissions.push(element.mission))
      const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
    
      filteredMissions.forEach(element => {
        var missions = {
          name:element 
        }
        store.push(missions)
      })
      console.log("This the missions outside foreach", store)



      res.status(200).json(store)

    } catch(e){
      console.log(e)
      res.status(500).send(e)
    } 
})

exports.postLogin = (req, res, next) => {
  
  let fetchedUser;
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: "Invalid authentication credentials!",
          });
          
        }
        fetchedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        const token = jwt.sign(
          {
            email: fetchedUser.email,
            userId: fetchedUser._id
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          userType: fetchedUser.userType
        });
      })
      .catch((err) => {

        console.log("Login error " + err)
          if(!res.headersSent){
            return res.status(401).json({
            message: "Auth failed",
          });
        }
      });
    }

exports.postSignup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const email = req.body.email
      const user = new User({
                    email: email,
                    mission: req.body.mission,
                    password: hash
                  });
                  console.log("whats the user", user)
    user.save()
    .then(result => {
      console.log("User created!")
      res.status(201).json({
        message: "User created",
        result: result,
      })
    }).catch(err => {
      res.status(500).json({
        message: "User with that email has already been created!",
      })
    })
  })
}

// exports.postSignup = (req, res, next) => {
//   const email = req.body.email
//   const password = req.body.password
//   const mission = req.body.mission
//   const confirmPassword = req.body.confirmPassword
//   User.findOne({ email: email })
//     .then(userDoc => {
//       if (userDoc) {
//         req.flash(
//           'error',
//           'E-Mail exists already, please pick a different one.'
//         );
//         return res.redirect('/signup');
//       }
//       return bcrypt
//         .hash(password, 12)
//         .then(hashedPassword => {
//           const user = new User({
//             email: email,
//             mission: mission,
//             password: hashedPassword
//           });
//           return user.save();
//         })
//         .then(result => {
//           res.redirect('/login');
//           return transporter.sendMail({
//             to: email,
//             from: 'bg@ibm.com',
//             subject: 'Signup succeeded!',
//             html: '<h1>You successfully signed up!</h1>'
//           });
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'milen.deyanov@ibm.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
};
