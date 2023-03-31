const express = require("express");
const Post = require("../models/post");

const router = express.Router();



router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json({
                message: "success",
                data: post
            });
        } else {
            res.status(404).json({
                message: "not found",
            });
        }
    });
});

router.post("", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then((post) => {
        res.status(200).json({
            message: "success",
            data: post
        });
    });
});

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then((post) => {
        res.status(200).json({
            message: "success",
            data: post
        });
    });
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(() => {
        res.status(200).json({
            message: "success",
        });
    });
});

router.use("", (req, res, next) => {
    Post.find()
        .then((posts) => {
            res.status(200).json({
                message: "success",
                data: posts
            });
        });
});

module.exports = router;