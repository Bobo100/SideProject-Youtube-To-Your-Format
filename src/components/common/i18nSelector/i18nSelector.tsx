import { useTranslation } from "react-i18next";
import styles from "./i18nSelector.module.scss";

const I18nSelector = () => {
    const { t, i18n } = useTranslation();

    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    }

    return (
        <select className={`ml-[10px] mr-[10px] mb-[10px] p-[10px] border border-black ${styles.themeToggle}`}
            onChange={(e) => handleChangeLanguage(e.target.value)} title={t('changeLanguage')}>
            <option value="zh">中文</option>
            <option value="en">English</option>
        </select>
    );
}

export default I18nSelector;