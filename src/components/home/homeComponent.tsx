import { useEffect, useState } from "react";
import styles from './homeComponent.module.scss';
import { useTranslation } from 'react-i18next';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import YoutubePanel from "./components/youtubePanel/youtubePanel";
import DownloadPanel from "./components/downloadPanel/downloadPanel";

export default function HomeComponent() {
    const { t } = useTranslation();
    const [activePanel, setActivePanel] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
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
        <div className={styles.container}>
            <YoutubePanel videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
            {/* <button onClick={() => setActivePanel(!activePanel)}
                className={styles.button}
            >{t('openDownloadPanel')}</button> */}
            {/* <DownloadPanel videoUrl={videoUrl} setVideoUrl={setVideoUrl} activePanel={activePanel} setActivePanel={setActivePanel} /> */}
        </div >
    )
}