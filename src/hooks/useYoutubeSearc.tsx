import { useState } from 'react';
import { Video } from '../utils/types';

const useYouTubeSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [error, setError] = useState<string | null>(null);  // 修改这里，允许 string 或 null
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/youtube?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setVideos(data.items);
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        query,
        setQuery,
        videos,
        handleSearch,
        error,
        isLoading
    };
};

export default useYouTubeSearch;
