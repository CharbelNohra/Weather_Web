import express from "express";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

const apiKey = process.env.API_KEY;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null });
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.render('index', { weatherData: null, error: 'Please enter a city' });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        const weatherData = response.data;
        res.render('index', { weatherData, error: null });
    } catch (error) {
        res.render('index', { weatherData: null, error: 'City not found' });
    }
});

app.get('/forecast', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.render('forecast', { forecastData: null, error: 'Please enter a city' });
    }

    try {
        // Get latitude and longitude for the city using OpenWeatherMap's current weather API
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        const { lat, lon } = response.data.coord;

        // Fetch 10-day weather forecast using One Call API
        const forecastResponse = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`
        );

        const forecastData = forecastResponse.data.daily.slice(0, 10); // Get only 10 days
        res.render('forecast', { forecastData, error: null, city });
    } catch (error) {
        res.render('forecast', { forecastData: null, error: 'City not found', city: null });
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});