import { useEffect, useState } from "react";
import styles from './homeComponent.module.scss';
import YoutubePanel from "./components/youtubePanel/youtubePanel";

export default function HomeComponent() {
    const [videoUrl, setVideoUrl] = useState('');
    useEffect(() => {
        // 動態加載 renderer.js 以確保這段代碼只在客戶端執行
        const script = document.createElement('script');
        script.src = '/renderer4YoutubePanel.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // 清理腳本，以防頁面卸載時的潛在問題
            document.body.removeChild(script);
        };
    }, []);


    return (
        <div className={styles.container}>
            <YoutubePanel videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
        </div >
    )
}