// const express = require("express");
// const passport = require("passport");
// const { userModel } = require("../model/user");
// const FacebookStrategy = require("passport-facebook").Strategy;
// const { v4: uuidv4 } = require("uuid");

// require("dotenv").config();

// const facebookRouter = express.Router();

// facebookRouter.get("/", passport.authenticate("facebook"));

// facebookRouter.get(
//   "/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: process.env.FACEBOOK_callbackURL,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       console.log(profile);
//       try {
//         let email = profile.email;
//         const user = await userModel.findOne({ email, provider: "facebook" });

//         if (!user) {
//           const newUser = new userModel({
//             name: profile._json.name,
//             email: email,
//             password: uuidv4(),
//             provider: profile.provider,
//           });

//           await newUser.save();
//           return cb(null, profile);
//         } else {
//           console.log("GitHub user already exists in DB...");
//         }
//       } catch (err) {
//         return cb(err, null);
//       }
//     }
//   )
// );
// module.exports = { facebookRouter };
