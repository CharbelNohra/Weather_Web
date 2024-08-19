import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config();

// Set up API key
const apiKey = process.env.API_KEY;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Handle GET request to the home page
app.get('/', (req, res) => {
    res.render('index', { weather: null, forecast: null, error: null });
});

// Handle POST request to get weather data
app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.render('index', { weather: null, forecast: null, error: "Please enter a city." });
    }

    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const forecastResponse = await axios.get(forecastUrl);

        const weather = weatherResponse.data;
        const forecast = forecastResponse.data;

        const filteredForecast = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));

        res.render('index', { weather, forecast: filteredForecast, error: null });
    } catch (error) {
        res.render('index', { weather: null, forecast: null, error: "City not found!" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
