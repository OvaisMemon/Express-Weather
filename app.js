var express = require("express");
var path = require("path");
var forecast = require("forecastio");
var zippity = require("zippity-do-dah");
var parser = require("body-parser");
const request = require("request");

var app = express();

const API_KEY = "1b465dc138e5d3e7299f72f6677928d4";
//var weather = new forecast(API_KEY);

app.use(express.static(path.resolve(__dirname, "public")));
app.use(parser.urlencoded({ extended: true }));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) =>{
   // let weather = "hello";
    res.render("index", { weather: null, error: null});
    
});

app.post("/", (req, res) => {
    var city = req.body.city;
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;

    console.log(url);
    request(url, function(err, response, body){
        if(err){
            res.render("index", { weather: null, error: "Error! Please try again."});
        }
        else{
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render("index", { weather: null, error: "Error! Please try again."});
            }
            else{
                let weatherText = `It is ${weather.main.temp} degrees in ${weather.name}!`;
                res.render("index", { weather: weatherText, error: null });
            }
        }
    });    
});
/*
app.get(/^\/(\d{5})$/, (req, res, next)=>{
    console.log("Entered zip code.");
    var zCode = req.params[0];
    var location = zippity.zipcode(zCode);

    console.log("Location is: " + location.zipcode);
    if(!location.zipcode){
        next();
        return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);

    weather.forecast(latitude,longitude, function(err, data){
        if(err){
            console.log("In error.");
            next();
            return;
        }

        console.log("sending json.");
        res.json({
            zipcode: zCode,
            temperature: data.currently.temperature
        });
    });    
});
*/

app.use((req, res)=>{
    res.status(404).render("404");
});

app.listen(3000, function(req, res){
    console.log("App is running on port 3000");
});