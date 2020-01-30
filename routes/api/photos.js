const express = require("express");
const router = express.Router();

// auth
const auth = require("../../middleware/auth");
const {
  validationPhoto,
  validate
} = require("../../middleware/checkValidator");
// models
const Photo = require("../../models/Photo");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route POST api/photos
// @desc   Create a photo
// @access Publis
router.post("/", [auth, validationPhoto(), validate], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPhoto = new Photo({
      image: req.body.image,
      text: req.body.text,
      keyword: req.body.keyword,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });
    const photo = await newPhoto.save();
    res.json(photo);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route GET api/photos
// @desc   GET all photos
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const photos = await Photo.find().sort({ date: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route GET api/photos/:id
// @desc   GET a photo by ID
// @access Private

router.get("/:id", auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    // Check if photo exists
    if (!photo) {
      return res.status(404).send({ msg: "photo not found" });
    }

    res.json(photo);
  } catch (err) {
    console.error(err.msg);
    if (err.kind === "ObjectId") {
      return res.status(404).send({ msg: "photo not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/photos/:id
// @desc   Delete a photo by ID
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    // Check if photo exists
    if (!photo) {
      return res.status(404).send({ msg: "photo not found" });
    }
    // Check user
    if (photo.user.toString() !== req.user.id) {
      return res.status(401).send({ msg: "User not authorized " });
    }
    await photo.remove();

    res.json({ msg: "photo removed" });
  } catch (err) {
    console.error(err.msg);
    if (err.kind === "ObjectId") {
      return res.status(404).send({ msg: "photo not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/photos/like/:id
// @desc   Like a photo by ID
// @access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    // Check if the photo has already been liked
    if (
      photo.likes.filter(like => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.json({ msg: "User already liked this photo" });
    }

    // Add user id to likes array
    photo.likes.unshift({ user: req.user.id });

    await photo.save();
    res.json(photo.likes);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/photos/unlike/:id
// @desc   Like a photo by ID
// @access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    // Check if the photo has already been liked
    if (
      photo.likes.filter(like => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.json({ msg: "User has not liked this photo" });
    }

    //   Get remove index
    const removeIndex = photo.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    photo.likes.splice(removeIndex, 1);

    await photo.save();
    res.json(photo.likes);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// // @route POST api/photos/comment/:id
// // @desc   Comment on a photo
// // @access Private
// router.post(
//   "/comment/:id",
//   [auth, [check("text", "Text is required").notEmpty()]],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//       const user = await User.findById(req.user.id).select("-password");
//       const photo = await Photo.findById(req.params.id);

//       const newComment = {
//         text: req.body.text,
//         name: user.name,
//         avatar: user.avatar,
//         user: req.user.id
//       };

//       // Add this comment into the post comment
//       post.comments.unshift(newComment);
//       await post.save();
//       res.json(post.comments);
//     } catch (err) {
//       console.error(err.msg);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// // @route DELETE api/posts/comment/:id/comment_id
// // @desc   Delete a comment on a post
// // @access Private

// router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     // Get the comment from the same exact post
//     const comment = post.comments.find(
//       comment => comment.id === req.params.comment_id
//     );

//     // Make sure the comment does exist
//     if (!comment) {
//       return res.status(404).json({ msg: "Comment does not exist" });
//     }

//     // Check if it's the same User who posted the comment will deleted
//     if (comment.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "User not authorized" });
//     }

//     //   Get remove index
//     const removeIndex = post.comments
//       .map(comment => comment.user.toString())
//       .indexOf(req.user.id);

//     post.comments.splice(removeIndex, 1);
//     await post.save();
//     res.json(post.comments);
//   } catch (err) {
//     console.error(err.msg);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
