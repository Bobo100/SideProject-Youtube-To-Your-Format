import { useTranslation } from "react-i18next";
import styles from './formatSelector.module.scss';

const FormatSelector = () => {
    const { t } = useTranslation();
    return (
        <select id="formatSelect" className={`${styles.select} step3`}
            defaultValue="mp3"
        >
            <option value="mp3">{t('mp3')}</option>
            <option value="mp4">{t('mp4')}</option>
        </select>
    )
}

export default FormatSelector;