const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to DB!');
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const campground = new Campground(
            {
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`
            }
        );
        await campground.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})