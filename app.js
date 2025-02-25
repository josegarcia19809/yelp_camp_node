const express = require('express');
const mongoose = require('mongoose');
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to DB!');
})

const app = express();
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render("home");
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
})

// El orden importa entre /campgrounds/new' y /campgrounds/:id'
// Pensaría el servidor que mando un id con la palabra new
app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new");
});

app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", {campground});
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.listen(3000, () => {
    console.log("Serving on port 3000...");
});