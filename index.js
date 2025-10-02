import express from "express";
import axios from "axios";
import bodyParser from "body-parser"
import 'dotenv/config';

const app = express();
const port = 3000;

const API_KEY = process.env.Weather_API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    res.render("index.ejs", {weather: null, error: null});
});

app.post("/weather", async (req, res) =>{
    const city = req.body.city;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try{
        const response = await axios.get(apiUrl);
        const forecastData = response.data.list;

        // Get tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDateString = tomorrow.toISOString().split('T')[0];

        let willRain = false;
        // Filter items for tomorrow(forecast list)
        const tomorrowsForecasts = forecastData.filter(item => {
            return item.dt_txt.startsWith(tomorrowDateString);
        });

        // Check any of tomorrow's forecasts include rain
        for (const forecast of tomorrowsForecasts) {
            // Weather condition IDs for rain are between 500 - 531
            if (forecast.weather[0].id >= 500 && forecast.weather[0].id <= 531) {
                willRain = true;
                break;
            }
        }

        let resultMessage;
        if (willRain) {
            resultMessage = `Yes, you might want to bring an umbrella! ☔ It's expected to rain in ${city} tomorrow.`;
        } else {
            resultMessage = `No, it looks like a dry day in ${city} tomorrow! ☀️`;
        }

        res.render("index.ejs", {weather: resultMessage, error: null});

    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        res.render("index.ejs",{
            weather: null,
            error: "Sorry, we couldn't find that city. Please try again."
        });
    }
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});
