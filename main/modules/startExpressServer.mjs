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
      // origin: (origin, callback) => {
      //   if (
      //     origin === "http://localhost:3000" ||
      //     origin === "app://-" ||
      //     !origin
      //   ) {
      //     // 允许这些来源的请求
      //     callback(null, true);
      //   } else {
      //     // 拒绝其他来源的请求
      //     callback(new Error("Not allowed by CORS"));
      //   }
      // },
      // 暫時改成允許所有來源的請求
      origin: "*",
    })
  );

  expressAPP.get("/api/youtube", async (req, res) => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const { query, pageToken } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.append("part", "snippet");
      url.searchParams.append("q", query);
      url.searchParams.append("type", "video");
      url.searchParams.append("maxResults", "10");
      url.searchParams.append("key", API_KEY);
      if (pageToken) {
        url.searchParams.append("pageToken", pageToken);
      }

      const response = await fetch(url.toString());

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
