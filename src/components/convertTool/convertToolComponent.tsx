import { useEffect } from 'react';
import styles from './convertToolComponent.module.scss';
import { useTranslation } from 'react-i18next';
import FormatSelector from './component/formatSelector/formatSelector';

export default function ConvertToolComponent() {
    const { t } = useTranslation();

    useEffect(() => {
        // 動態加載 renderer.js 以確保這段代碼只在客戶端執行
        const script = document.createElement('script');
        script.src = '/renderer4Convert.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // 清理腳本，以防頁面卸載時的潛在問題
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className={styles.container}>
            <button id="selectFileButton" className={styles.selectFileButton}> {t('selectFileButton')} </button>
            <FormatSelector />
            <button id="convertButton" className={styles.convertButton}>
                {t('convertButton')}
            </button>
        </div >
    )
}