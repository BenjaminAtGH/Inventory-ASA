import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//connect to mysql database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// check if connection successful
db.connect((err) => {
    if (er) {
        console.error("koneksi gagal:",err);
    }
});

// routes

app.get("/", (req, res) => {
    res.send("Server menyala dan terkoneksi ke database");

});

// get all items
app.get("/", (req, res) => {
    db.query("SELECT * FROM items", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    })
})
