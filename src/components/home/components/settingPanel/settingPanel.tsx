import { useTranslation } from "react-i18next";
import styles from "./settingPanel.module.scss";
import { SettingPanelProps } from "@/utils/types";
import ApiKeyInput from "../apiKeyInput/apiKeyInput";
import { useEffect, useRef, useState } from "react";
import { setSettingModalOpen } from "@/redux/slice/settingSlice";
import { useAppDispatch } from "@/redux/hook/hook";

const TRANSITION_DURATION = 400;

const SettingPanel = ({ opened, apiKey, setApiKey }: SettingPanelProps) => {
    const { t } = useTranslation();
    const [delayClose, setDelayClose] = useState(false);
    const timerRef = useRef<any>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!opened) {
            timerRef.current = setTimeout(
                () => setDelayClose(false),
                TRANSITION_DURATION
            );
        } else {
            clearTimeout(timerRef.current);
            setDelayClose(true);
        }
        return () => clearTimeout(timerRef.current);
    }, [opened]);

    const getStyles = () => {
        if (opened) {
            return styles.opened;
        } else if (!delayClose) {
            return styles.closed;
        }
        return;
    };

    const handleModalClose = () => {
        dispatch(setSettingModalOpen(false));
    }

    return (
        <div className={`${styles.container} ${getStyles()}`} onClick={handleModalClose}>
            <div className={styles.modal}
                onClick={(e) => e.stopPropagation()}>
                <h1>{t('setting')}</h1>
                <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
            </div>
        </div>
    );
}

export default SettingPanel;