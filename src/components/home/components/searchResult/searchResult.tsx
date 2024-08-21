import { useTranslation } from 'react-i18next';
import styles from './searchResult.module.scss';
import { SearchResultProps } from "@/utils/types";

const SearchResult = ({ videos, setVideoUrl }: SearchResultProps) => {

    const { t } = useTranslation();

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
    )
}

export default SearchResult;