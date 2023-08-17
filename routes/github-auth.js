const express = require("express");
const passport = require("passport");
const { userModel } = require("../model/user");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

const gitRouter = express.Router();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.callbackURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await userModel.findOne({
          accountId: profile.id,
          provider: "github",
        });

        console.log(profile);
        if (!user) {
          console.log("Adding new GitHub user to DB...");
          const newUser = new userModel({
            accountId: profile.id,
            name: profile.username,
            provider: profile.provider,
          });

          await newUser.save();
          console.log(newUser);
        } else {
          console.log("GitHub user already exists in DB...");
        }

        return cb(null, profile);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

gitRouter.get("/", passport.authenticate("github", { scope: ["user:email"] }));

gitRouter.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

gitRouter.get("/error", (req, res) =>
  res.send("Error logging in via GitHub...")
);

module.exports = { gitRouter };
