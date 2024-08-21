import { useTranslation } from "react-i18next";
import styles from './apiKeyInput.module.scss';
import { ApiKeyInputProps } from "@/utils/types";

const ApiKeyInput = ({ apiKey, setApiKey }: ApiKeyInputProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.apiKeyContainer}>
            <p className={styles.title}
            >{t('apiKeyTitle')}</p>
            <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('apiKeyPlaceholder')}
                className={styles.input}
            />
        </div>
    )
}

export default ApiKeyInput;