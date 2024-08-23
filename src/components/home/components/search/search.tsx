import { useTranslation } from 'react-i18next';
import styles from './search.module.scss';
import { SearchProps } from "@/utils/types";
import FormatSelector from '../formatSelector/formatSelector';
import { useState } from 'react';

const Search = ({ videoUrl, setVideoUrl, query, setQuery, showSearch, setShowSearch }: SearchProps) => {

    const { t } = useTranslation();

    return (
        <>
            <div className={styles.container}>
                {showSearch && <>
                    <p className={styles.title}
                    >{t('searchVideo')}</p>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('searchVideo2')}
                        className={styles.input}
                    />
                </>
                }
                <input type="text" id="youtubeUrl" placeholder={t('youtubeUrlPlaceholder')}
                    className={`${styles.input}`} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} hidden={showSearch} />
                <FormatSelector />
            </div>

        </>
    )
}

export default Search;