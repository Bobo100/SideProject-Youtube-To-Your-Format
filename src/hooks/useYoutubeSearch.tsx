import { useState } from 'react';
import { HandleSearchProps, Video } from '../utils/types';

const useYouTubeSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async ({ pageToken = '', firstTime = false }: HandleSearchProps = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL('http://localhost:3001/api/youtube');
            url.searchParams.append('query', query);
            if (pageToken) {
                url.searchParams.append('pageToken', pageToken);
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (firstTime) {
                setVideos(data.items);
            } else {
                setVideos((prevVideos) => [...prevVideos, ...data.items]);
            }
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
        isLoading,
    };
};

export default useYouTubeSearch;
