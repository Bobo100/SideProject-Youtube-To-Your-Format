import Layout from "@/components/layout";
import { useEffect } from "react";

function HomePage() {
  useEffect(() => {
    // 動態加載 renderer.js 以確保這段代碼只在客戶端執行
    const script = document.createElement('script');
    script.src = '/renderer.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // 清理腳本，以防頁面卸載時的潛在問題
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Layout>
      <h1>YouTube to Your Format Converter</h1>
      <input type="text" id="youtubeUrl" placeholder="Enter YouTube URL" />
      <button id="selectFolderButton">Select Output Folder</button>
      <input type="text" id="outputPath" placeholder="Output Path" />
      <button id="downloadButton">Download and Convert</button>
      <p id="status"></p>
    </Layout>
  )
}

export default HomePage;
