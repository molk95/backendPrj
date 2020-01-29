const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// auth
const auth = require("../../middleware/auth");
// models
const Photo = require("../../models/Photo");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route POST api/photos
// @desc   Create a photo
// @access Publis
router.post(
  "/",
  [
    auth,

    [
      check("image", "photo is required").notEmpty(),
      check("text", "text is required").notEmpty(),
      check("keyword", "keyword is required").notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { image, text, keyword } = req.body;

    // Build photo object
    const photoFields = {};
    photoFields.user = req.user.id;
    if (req.body.image) photoFields.image = image;
    if (req.body.text) photoFields.text = text;
    if (req.body.keyword) photoFields.keyword = keyword;
  

    Photo.findOne({ user: req.user.id }).then(photo => {
      if (photo) {
        // Update
        Photo.findOneAndUpdate(
          { user: req.user.id },
          { $set: photoFields },
          { new: true }
        ).then(photo => res.json(photo));
      } else {
        // const user = await User.findById(req.user.id).select("-password");
        // Create

        // Check if handle exists
        Photo.findOne({ handle: photoFields.handle }).then(photo => {
          // if (profile) {
          //   errors.handle = "That handle already exists";
          //   res.status(400).json(errors);
          // }

          // Save Photo

          new Photo({ photoFields })
            .save()
            .then(photo => res.json(photo))
            .catch(function(error) {
              console.error(error);
            });
        });
      }
    });
  }
);

// @route GET api/photos
// @desc   GET all photos
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const photos = await Photo.find().sort({ date: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err.message);
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
      return res.status(404).send({ message: "photo not found" });
    }

    res.json(photo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).send({ message: "photo not found" });
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
      return res.status(404).send({ message: "photo not found" });
    }
    // Check user
    if (photo.user.toString() !== req.user.id) {
      return res.status(401).send({ message: "User not authorized " });
    }
    await photo.remove();

    res.json({ message: "photo removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).send({ message: "photo not found" });
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
      return res.json({ message: "User already liked this photo" });
    }

    // Add user id to likes array
    photo.likes.unshift({ user: req.user.id });

    await photo.save();
    res.json(photo.likes);
  } catch (err) {
    console.error(err.message);
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
      return res.json({ message: "User has not liked this photo" });
    }

    //   Get remove index
    const removeIndex = photo.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    photo.likes.splice(removeIndex, 1);

    await photo.save();
    res.json(photo.likes);
  } catch (err) {
    console.error(err.message);
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
//       console.error(err.message);
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
//       return res.status(404).json({ message: "Comment does not exist" });
//     }

//     // Check if it's the same User who posted the comment will deleted
//     if (comment.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: "User not authorized" });
//     }

//     //   Get remove index
//     const removeIndex = post.comments
//       .map(comment => comment.user.toString())
//       .indexOf(req.user.id);

//     post.comments.splice(removeIndex, 1);
//     await post.save();
//     res.json(post.comments);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
