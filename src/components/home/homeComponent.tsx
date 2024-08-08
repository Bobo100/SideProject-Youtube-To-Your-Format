import { useEffect, useState } from "react";
import styles from './homeComponent.module.scss';
import { useTranslation } from 'react-i18next';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

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

    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState([
        {
            target: '.step1',
            content: '第一步，貼上youtube的網址',
        },
        {
            target: '.step2',
            content: '第二步，選擇要輸出到哪個資料夾',
        },
        {
            target: '.step3',
            content: '第三步，選擇你想要的格式',
        },
        {
            target: '.step4',
            content: '最後一步，點擊下載按鈕',
        }
    ]);

    const handleClickStart = () => {
        setRun(true);
    };

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
        }
    };



    return (
        <div className={styles.container}>
            <p>{t('login')}</p>
            <input type="text" id="youtubeUrl" placeholder={t('youtubeUrlPlaceholder')}
                className={`${styles.input} step1`} />
            <button id="selectFolderButton"
                className={`${styles.button} step2`}>{t('selectForderButton')}</button>
            <input type="text" id="outputPath" placeholder="Output Path"
                className={styles.input}
                readOnly
                hidden
            />
            {/* 新增格式選取 */}
            <select id="formatSelect" className={`${styles.select} step3`}>
                <option value="mp3">{t('mp3')}</option>
                <option value="mp4">{t('mp4')}</option>
            </select>
            <button id="downloadButton"
                className={`${styles.button} step4`}>{t('downloadAndConvert')}</button>
            <p id="status"></p>
            <Joyride
                steps={steps}
                run={run}
                callback={handleJoyrideCallback}
                continuous
                scrollToFirstStep
                showProgress
                showSkipButton
            />
            <button className={styles.joyrideButton}
                onClick={handleClickStart}>{t('joyrideIntroClick')}</button>
        </div >
    )
}