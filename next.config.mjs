/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
