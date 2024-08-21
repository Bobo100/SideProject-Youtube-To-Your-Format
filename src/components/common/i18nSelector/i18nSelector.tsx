import { useTranslation } from "react-i18next";
import styles from "./i18nSelector.module.scss";
import { useRouter } from "next/router";
import routerUtils from "@/utils/routerUtils";

const I18nSelector = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { pathname, query } = router;

    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
        routerUtils.replace(router, pathname, { ...query, locale: language });
    }

    return (
        <select className={`p-[10px] border border-black ${styles.themeToggle}`}
            onChange={(e) => handleChangeLanguage(e.target.value)} title={t('changeLanguage')}>
            <option value="zh">中文</option>
            <option value="en">English</option>
        </select>
    );
}

export default I18nSelector;