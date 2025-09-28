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

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});
