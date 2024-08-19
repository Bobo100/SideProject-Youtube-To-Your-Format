import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 加载 .env 文件中的内容到 process.env
dotenv.config();

export const startExpressServer = () => {
  const expressAPP = express();

  // 启用 CORS，允许来自 http://localhost:3000 的请求
  expressAPP.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  expressAPP.get("/api/youtube", async (req, res) => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    console.log(API_KEY);
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

  const server = expressAPP.listen(3001, () => {
    console.log("Express server is running on http://localhost:3001");
  });

  return server;
};
