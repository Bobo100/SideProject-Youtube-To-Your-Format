import styles from './progressBar.module.scss'
import { useTranslation } from 'react-i18next';
interface ProgressBarProps {
    id: string;
    type?: string;
}
const ProgressBar = (props: ProgressBarProps) => {
    const { id, type = 'download' } = props;
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <p className={styles.title}>
                {type === 'download' ? t('downloadProgress') : t('convertProgress')}
            </p>
            <div className={styles.progressContainer}>
                <div id={id} className={styles.progressBar}>0%</div>
            </div>
        </div>
    )
}

export default ProgressBar;