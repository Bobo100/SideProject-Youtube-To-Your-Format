
import path from 'path';
import { fileURLToPath } from 'url';
// 创建 __dirname 等效的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

// const path = require("path");

// module.exports = {
//   output: "export",
//   sassOptions: {
//     includePaths: [path.join(__dirname, "styles")],
//   },
//   images: {
//     // i.imgur.com
//     domains: ["i.imgur.com"],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//   },
// };
