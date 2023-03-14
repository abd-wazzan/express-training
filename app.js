const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/post');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect("mongodb+srv://wazzan:QCdED79zcGERtG9q@cluster0.plvrf8z.mongodb.net/test?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected")
    })
    .catch(() => {
        console.log("Not Connected")
    });
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});

app.post("/api/posts", (req, res, next) => {
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

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(() => {
        res.status(200).json({
            message: "success",
        });
    });
});

app.use('/api/posts', (req, res, next) => {
    Post.find()
        .then((posts) => {
            res.status(200).json({
                message: "success",
                data: posts
            });
        });
});

module.exports = app;