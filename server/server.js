const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config(); // 加载环境变量

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/youtube", async (req, res) => {
  const API_KEY = process.env.YOUTUBE_API_KEY; // 从环境变量中获取 API 密钥
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=10&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
