import styles from './progressBar.module.scss'
import { useTranslation } from 'react-i18next';
const ProgressBar = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <p className={styles.title}
            >{t('progressBar')}</p>
            <div id="progress-container" className={styles.progressContainer}>
                <div id="progress-bar" className={styles.progressBar}>0%</div>
            </div>
        </div>
    )
}

export default ProgressBar;