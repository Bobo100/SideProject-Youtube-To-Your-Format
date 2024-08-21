import { useTranslation } from 'react-i18next';
import styles from './search.module.scss';
import { SearchProps } from "@/utils/types";
import FormatSelector from '../formatSelector/formatSelector';

const Search = ({ videoUrl, setVideoUrl, query, setQuery }: SearchProps) => {

    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <p className={styles.title}
            >{t('searchVideo')}</p>
            <input type="text" id="youtubeUrl" placeholder={t('youtubeUrlPlaceholder')}
                className={`${styles.input}`} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} hidden />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchVideo2')}
                className={styles.input}
            />
            <FormatSelector />
        </div>
    )
}

export default Search;