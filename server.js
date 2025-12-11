import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import useragent from "express-useragent";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(useragent.express());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Model
const visitorSchema = new mongoose.Schema({
    ip: String,
    os: String,
    browser: String,
    device: String,
    time: { type: Date, default: Date.now }
});
const Visitor = mongoose.model("Visitor", visitorSchema);

// API Route
app.post("/track", async (req, res) => {
    const info = {
        ip: req.ip,
        os: req.useragent.os,
        browser: req.useragent.browser,
        device: req.useragent.platform
    };

    await Visitor.create(info);
    res.json({ message: "Stored" });
});

app.get("/", (req, res) => {
    res.send("API WORKING");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));
