import useYouTubeSearch from "@/hooks/useYoutubeSearch";
import styles from './youtubePanel.module.scss';
import { useTranslation } from "react-i18next";
import {  useEffect, useState } from "react";
import { YoutubeCommonProps } from "@/utils/types";
import FormatSelector from "../formatSelector/formatSelector";
import { getThemeClassName } from "@/utils/commonFunction";
import { useTheme } from "next-themes";
import useWindowWidth from "@/hooks/useWindowWidth";
import SelectFolder from "../selectFolder/selectFolder";

const YoutubeComponent: React.FC<YoutubeCommonProps> = ({ videoUrl, setVideoUrl }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { handleSearch, videos, query, setQuery, isLoading } = useYouTubeSearch();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const { width } = useWindowWidth();

    useEffect(() => {
        const handleScroll = async () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 150 && !isLoading && videos.length) {
                await handleSearch();
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

    const getThumbnailUrl = (thumbnails: any) => {
        return (
            thumbnails.maxres?.url ||
            thumbnails.standard?.url ||
            thumbnails.high?.url ||
            thumbnails.medium?.url ||
            thumbnails.default.url
        );
    };

    return (
        <>
            <div className={`${styles.fixedHeader} ${getThemeClassName('fixedHeader', styles, theme)} ${visible ? `${styles.fixedHeader_Visible}` : ''}`}>
                <div className={styles.searchContainer}>
                    <p className={styles.searchTitle}
                    >{t('searchVideo2')}</p>
                    <input type="text" id="youtubeUrl" placeholder={t('youtubeUrlPlaceholder')}
                        className={`${styles.input}`} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} hidden />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('searchVideo')}
                        className={styles.searchInput}
                    />
                    <FormatSelector />
                </div>
                <SelectFolder />
                <button onClick={async () => await handleSearch({ firstTime: true })}
                    className={styles.searchButton}
                >{t('search')}</button>
                <div id="progress-container" className={styles.progressContainer}>
                    <div id="progress-bar" className={styles.progressBar}>0%</div>
                </div>
                <p id="status"></p>
            </div>
            <button id="downloadButton"
                className={`${styles.button}`}
                hidden>
                {t('downloadAndConvert')}
            </button>
            <div className={styles.videoContainer}>
                {videos.map((video, index) => (
                    <div key={index}>
                        <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={getThumbnailUrl(video.snippet.thumbnails)} alt={video.snippet.title}
                            />
                            <h3 className={styles.videoTitle}
                            >{video.snippet.title}</h3>
                        </a>
                        <button className={styles.downloadButton} onClick={async () => {
                            await setVideoUrl(`https://www.youtube.com/watch?v=${video.id.videoId}`);
                            const downloadButton = document.getElementById('downloadButton');
                            if (downloadButton) {
                                downloadButton.click();
                            }
                        }}>
                            {t('downloadAndConvert')}
                        </button>

                    </div>
                ))}
            </div>
            {isLoading && <div className={styles.loading}>{t('loading')}</div>}
        </>
    )
}

export default YoutubeComponent;