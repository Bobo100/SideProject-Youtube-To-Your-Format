import { useEffect, useRef, useState } from "react";
import styles from './homeComponent.module.scss';

export default function HomeComponent() {

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
            <input type="text" id="youtubeUrl" placeholder="Enter YouTube URL"
                className={styles.input} />
            <button id="selectFolderButton"
                className={styles.button}>Select Output Folder</button>
            <input type="text" id="outputPath" placeholder="Output Path"
                className={styles.input}
                readOnly
                hidden
            />
            <button id="downloadButton"
                className={styles.button}>Download and Convert</button>
            <p id="status"></p>
        </div >
    )
}