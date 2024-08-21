import { useTranslation } from "react-i18next";
import styles from './selectFolder.module.scss';

const SelectFolder = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.selectFolder}>
            <button id="selectFolderButton"
                className={`${styles.button}`}>{t('selectForderButton')}</button>
            <input type="text" id="outputPath" placeholder={t('outputPathPlaceholder')}
                className={styles.input}
                readOnly
                onClick={() => {
                    const selectFolderButton = document.getElementById('selectFolderButton');
                    if (selectFolderButton) {
                        selectFolderButton.click();
                    }
                }}
            />
        </div>
    )
}

export default SelectFolder;