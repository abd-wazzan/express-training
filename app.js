const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const PostRoutes = require('./routes/posts');
const AuthRoutes = require('./routes/auth');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/storage/images", express.static(path.join("storage/images")));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://wazzan:" + process.env.MONGO_ATLAS_PW + "@cluster0.plvrf8z.mongodb.net/test?retryWrites=true&w=majority", () => {
    console.log("Connected to MongoDB");
})
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
        'origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});

app.use("/api/posts", PostRoutes);
app.use("/api/auth", AuthRoutes);

module.exports = app;