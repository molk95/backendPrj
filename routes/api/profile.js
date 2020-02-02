const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const request = require("request");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/users/profile/current
// @desc   Get current  user profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["firstname,lastname, avatar"]);

    // check if there's no profile
    if (!profile) {
      return res.status(400).json({ msg: "This profile doesn't exist" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route POST api/users/profile
// @desc   Create or update  user profile
// @access Private
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    website,
    location,
    bio
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.website) profileFields.website = website;
  if (req.body.location) profileFields.location = location;
  if (req.body.bio) profileFields.bio = bio;
 
// Social
profileFields.social = {};
if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
if (req.body.instagram) profileFields.social.instagram = req.body.instagram;


  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile));
    } else {
      // Create

      // Check if handle exists
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        // if (profile) {
        //   errors.handle = "That handle already exists";
        //   res.status(400).json(errors);
        // }

        // Save Profile
        new Profile(profileFields)
          .save()
          .then(profile => res.json(profile))
          .catch(function(error) {
            console.error(error);
          });
      });
    }
  });
});

// @route GET api/users/profile
// @desc   Get All profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route GET api/users/profile/user/:user_id
// @desc   Get profile by user ID
// @access Private
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json({ msg: "Profile not found!" });
    res.json(profile);
  } catch (err) {
    console.error(err.msg);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found!" });
    }
    res.status(500).send("Server Error");
  }
});





// @route DELETE api/profile
// @desc   Delete profile, user and photo
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove Users photos
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
