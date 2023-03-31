const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const PostRoutes = require('./routes/posts');

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

app.use("/api/posts", PostRoutes);

module.exports = app;