import useYouTubeSearch from "@/hooks/useYoutubeSearch";
import styles from './youtubePanel.module.scss';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { YoutubeCommonProps } from "@/utils/types";
import { getThemeClassName } from "@/utils/commonFunction";
import { useTheme } from "next-themes";
import useWindowWidth from "@/hooks/useWindowWidth";
import SelectFolder from "../selectFolder/selectFolder";
import SearchResult from "../searchResult/searchResult";
import ProgressBar from "@/components/common/progressBar/progressBar";
import Search from "../search/search";
import SettingPanel from "../settingPanel/settingPanel";
import { useAppSelector } from "@/redux/hook/hook";
import { reduxSettingData } from "@/redux/slice/settingSlice";

const YoutubeComponent = ({ videoUrl, setVideoUrl }: YoutubeCommonProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { width } = useWindowWidth();
    const { handleSearch, videos, query, setQuery, isLoading, apiKey, setApiKey, pageToken } = useYouTubeSearch();

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const settingData = useAppSelector(reduxSettingData);

    useEffect(() => {
        const handleScroll = async () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 150 && !isLoading && videos.length) {
                await handleSearch({ pageToken: pageToken });
            }

            const currentScrollPos = window.scrollY;
            const visible = prevScrollPos >= currentScrollPos;
            if (width < 1024) {
                setVisible(true);
                setPrevScrollPos(currentScrollPos);
                return;
            }
            setPrevScrollPos(currentScrollPos);
            setVisible(visible);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, handleSearch]);

    const handleSearchLogic = async ({ firstTime = false }) => {
        await handleSearch({ firstTime });
        const localStorageApiKey = localStorage.getItem('apiKey');
        if ((localStorageApiKey && apiKey && localStorageApiKey !== apiKey) || !localStorageApiKey) {
            localStorage.setItem('apiKey', apiKey);
        }
    }

    return (
        <>
            <div className={`${styles.fixedHeader} ${getThemeClassName('fixedHeader', styles, theme)} ${visible ? `${styles.fixedHeader_Visible}` : ''}`}>
                <div className="flex mb-[10px]">
                    <h1 className={styles.title}>
                        {t('nowMode')} {showSearch ? t('searchMode') : t('urlMode')}
                    </h1>
                    <button className={styles.switchButton}
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        {t('switch')} {showSearch ? t('urlMode') : t('searchMode')}
                    </button>
                </div>
                <Search
                    videoUrl={videoUrl}
                    setVideoUrl={setVideoUrl}
                    query={query}
                    setQuery={setQuery}
                    showSearch={showSearch}
                    setShowSearch={setShowSearch}
                />
                <SelectFolder />
                {showSearch && <button onClick={() => handleSearchLogic({ firstTime: true })}
                    className={styles.searchButton}
                >{t('search')}</button>
                }
                <button id="downloadButton"
                    className={styles.downloadButton}
                    hidden={showSearch}>
                    {t('downloadAndConvert')}
                </button>
                <ProgressBar id='download-progress' type='download' />
                <p id="status"></p>
            </div>

            <SearchResult videos={videos} setVideoUrl={setVideoUrl} />
            {isLoading && <div className={styles.loading}>{t('loading')}</div>}
            <SettingPanel opened={settingData.open}
                apiKey={apiKey} setApiKey={setApiKey} />
        </>
    )
}

export default YoutubeComponent;