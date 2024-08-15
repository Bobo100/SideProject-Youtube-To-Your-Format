import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './themeToggle.module.scss';
import { getThemeClassName } from '@/utils/commonFunction';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <select className={`m-[10px] p-[10px] border border-black 
        ${styles.themeToggle} ${getThemeClassName('themeToggle', styles, theme)}`}
            value={theme} onChange={(e) => setTheme(e.target.value)} title='Change theme'>
            <option value="system">{t('System')}</option>
            <option value="dark">{t('Dark')}</option>
            <option value="light">{t('Light')}</option>
        </select>
    );
};

export default ThemeToggle;