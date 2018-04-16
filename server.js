const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const gmaps = require('./public/js/gmaps.js')
const darksky = require('./public/js/darksky.js')
const pixbay = require('./public/js/pixbay.js')

const port = process.env.PORT || 8080;
const urlencodedParser = bodyParser.urlencoded({ extended: false});

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.set('views', './views');
app.set('view engine', 'hbs');

var weather_info = {}
var image_url = {}

app.get('/', (req, res) => {
    res.render('main.hbs');
});

app.get('/weather', (req, res) => {
    res.render('weather.hbs', {
        location: weather_info.loc,
        summary: weather_info.Summary,
        temperature: weather_info.Temperature,
        timezone: weather_info.Timezone
    });
});

app.post('/getWeather', urlencodedParser, (req, res) => {
    gmaps.getCoordinates(req.body.weather_input).then((location) => {
        return darksky.getWeather(location.lat, location.lng);
    }).then((results) => {
        weather_info = {
            loc: `${req.body.weather_input}`,
            Summary: `${results.summary}`,
            Temperature: `${results.temp}${decodeURI('%C2%B0')}C`,
            Timezone: `${results.timezone}`
        }
        res.redirect('/weather')
    }).catch((error) => {
        console.log(error);
    });
});

app.post('/getGallery', urlencodedParser, (req, res) => {
    pixbay.getImages(req.image_input).then((result) => {
        res.render('images.hbs', {
            img_source: result.img_url1,
            img_source_2: result.img_url2
        });
    }).catch((error) => {
        console.log(error);
    });
});

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
