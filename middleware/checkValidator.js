const { check, validationResult } = require("express-validator");

exports.validationRule = () => [
  check("firstname", "First Name is required").notEmpty(),
  check("lastname", "Last Name is required").notEmpty(),
  check("email", "Please include a valid Email")
    .isEmail()
    .normalizeEmail(),
  check(
    "password",
    "Please enter a password with 8 or more characters"
  ).isLength({ min: 8 })
];

exports.validationLogin = () => [
  check("email", "Please include a valid Email")
    .isEmail()
    .normalizeEmail(),
  check("password", "Password is required!").exists()
];

exports.validationPhoto = () => [
  check("image", "photo is required").notEmpty(),
  check("text", "text is required").notEmpty(),
  check("keyword", "keyword is required").notEmpty()
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  return next();
};
