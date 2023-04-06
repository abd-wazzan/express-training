const express = require("express");
const Post = require("../models/post");
const multer = require("multer");

const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "storage/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '_' + Date.now() + '.' + ext);
    }
});



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

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/storage/images/" + req.file.filename
    });
    post.save().then((post) => {
        res.status(200).json({
            message: "success",
            data: post
        });
    });
});

router.put("/:id", multer({storage: storage}).single("image"),(req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath =  url + "/storage/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
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

router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        //validate
        postQuery.skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    postQuery
        .then(posts => {
            fetchedPosts = posts;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "success",
                data: fetchedPosts,
                count: count
            });
        });
});

module.exports = router;