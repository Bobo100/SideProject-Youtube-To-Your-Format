import useYouTubeSearch from "@/hooks/useYoutubeSearch";
import styles from './youtubePanel.module.scss';
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction } from "react";
import { YoutubeCommonProps } from "@/utils/types";

const YoutubeComponent: React.FC<YoutubeCommonProps> = ({ setVideoUrl }) => {
    const { t } = useTranslation();
    const { handleSearch, videos, query, setQuery } = useYouTubeSearch();
    return (
        <>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchVideo')}
                className={styles.searchInput}
            />
            <button onClick={handleSearch}
                className={styles.searchButton}
            >{t('search')}</button>
            <div>
                {videos.map((video, index) => (
                    <div key={video.id.videoId}>
                        <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                            <h3>{video.snippet.title}</h3>
                        </a>
                        <div className={styles.copyUrl} onClick={() => setVideoUrl(`https://www.youtube.com/watch?v=${video.id.videoId}`)}>
                            {t('copyUrl')}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default YoutubeComponent;