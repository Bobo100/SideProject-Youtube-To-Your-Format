import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  output: "export",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    unoptimized: true,
  },
  // 有output: "export"时，不能配置i18n
  // i18n: {
  //   locales: ["en", "zh"],
  //   defaultLocale: "zh",
  // },
};

export default nextConfig;
