const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const { validationRule, validate } = require("../../middleware/checkValidator");

// User model
const User = require("../../models/User");

// @route POST api/users/devStudent
// @desc   Register user
// @access Publis

router.post("/", validationRule(), validate, async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    // See if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ message: "User already exists" }] });
    }

    //Get users gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });

    user = new User({
      firstname,
      lastname,
      email,
      avatar,
      password
    });
    // Encrypt(hashed) password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    //Create (the payload) and Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// // @route    GET users/
// // @desc     get users
// // @access   Private
// router.get('/', [auth, admin], async (req, res) => {
//   try {
//     const users = req.query.role
//       ? await User.find({ role: req.query.role })
//       : await User.find();
//     if (!users) {
//       return res.status(404).send({ message: 'no users were found' });
//     }
//     return res.send(users);
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

// // @route    DELETE users/:id
// // @desc     Delete a user by ID
// // @access   Private
// router.delete('/:id', [auth, admin], async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user)
//       return res
//         .status(404)
//         .send({ message: 'The user with the given ID was not found.' });

//     res.send({ message: 'user was removed' });
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });
module.exports = router;
