import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import styles from './downloadPanel.module.scss';
import { DownloadPanelProps } from "@/utils/types";

const DownloadPanel: React.FC<DownloadPanelProps> = ({ videoUrl, setVideoUrl, activePanel, setActivePanel }) => {

    const { t } = useTranslation();

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
        <div className={`${styles.container} ${activePanel ? styles.active : ''}`}
            onClick={() => { setActivePanel(false) }}
        >
            <div className={`${styles.panel} ${activePanel ? styles.activePanel : ''}`} onClick={(e) => e.stopPropagation()}>
                <input type="text" id="youtubeUrl" placeholder={t('youtubeUrlPlaceholder')}
                    className={`${styles.input} step1`} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                <button id="selectFolderButton"
                    className={`${styles.button} step2`}>{t('selectForderButton')}</button>
                <input type="text" id="outputPath" placeholder="Output Path"
                    className={styles.input}
                    readOnly
                    hidden
                />
                {/* 新增格式選取 */}
                <select id="formatSelect" className={`${styles.select} step3`}
                    defaultValue="mp3"
                >
                    <option value="mp3">{t('mp3')}</option>
                    <option value="mp4">{t('mp4')}</option>
                </select>
                <button id="downloadButton"
                    className={`${styles.button} step4`}>{t('downloadAndConvert')}</button>
                <p id="status"></p>
                <div id="progress-container" className={styles.progressContainer}>
                    <div id="progress-bar" className={styles.progressBar}>0%</div>
                </div>
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
            </div>
        </div >
    )
}

export default DownloadPanel;