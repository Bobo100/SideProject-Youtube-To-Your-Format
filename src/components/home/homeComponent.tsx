import { useEffect, useRef, useState } from "react";
import styles from './homeComponent.module.scss';
import { useTranslation } from 'react-i18next';

export default function HomeComponent() {
    const { t } = useTranslation();
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
            <p>{t('login')}</p>
            <input type="text" id="youtubeUrl" placeholder={t('youtubeUrlPlaceholder')}
                className={styles.input} />
            <button id="selectFolderButton"
                className={styles.button}>{t('selectForderButton')}</button>
            <input type="text" id="outputPath" placeholder="Output Path"
                className={styles.input}
                readOnly
                hidden
            />
            {/* 新增格式選取 */}
            <select id="formatSelect" className={styles.select}>
                <option value="mp3">{t('mp3')}</option>
                <option value="mp4">{t('mp4')}</option>
            </select>
            <button id="downloadButton"
                className={styles.button}>{t('downloadAndConvert')}</button>
            <p id="status"></p>
        </div >
    )
}