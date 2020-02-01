const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const {
  validationLogin,
  validate
} = require("../../middleware/checkValidator");

// @route GET api/auth
// @desc   authorisation route
// @access Publis
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // minus the password
    res.json(user);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route POST api/auth
// @desc   Authenticate user and get token
// @access Publis

router.post("/", validationLogin(), validate, async (req, res) => {
  const { email, password } = req.body;
  try {
    // See if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Password or Email!" }] });
    }

    // Match the email and password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Password or Email!" }] });
    }

    //Create (the payload) and Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 3600000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("server error");
  }
});

module.exports = router;
