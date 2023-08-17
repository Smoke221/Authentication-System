const express = require("express");
const passport = require("passport");
const { userModel } = require("../model/user");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const gitRouter = express.Router();

gitRouter.get("/", passport.authenticate("github", { scope: ["user:email"] }));

gitRouter.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    let user = req.user;
    const token = jwt.sign({ userID: user._id }, "secret", {
      expiresIn: "1hr",
    });
    // Successful authentication, redirect home.
    res.redirect("http://localhost:8000/user");
    res.json({ token });
  }
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.callbackURL,
      scope: "user:email",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // console.log(profile);

        let email = profile.emails[0].value;
        const user = await userModel.findOne({ email, provider:"github" });

        if (!user) {
          console.log("Adding new GitHub user to DB...");
          const newUser = new userModel({
            name: profile._json.name,
            email: email,
            password: uuidv4(),
            provider:profile.provider
          });

          await newUser.save();
          return cb(null, profile);
        } else {
          console.log("GitHub user already exists in DB...");
        }
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

module.exports = { gitRouter };
