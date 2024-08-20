import { useEffect, useState } from 'react';
import { HandleSearchProps, Video } from '@/utils/types';

const useYouTubeSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState<string>('');
    const [pageToken, setPageToken] = useState<string>('');

    useEffect(() => {
        const storedApiKey = localStorage.getItem('apiKey') as string;
        setApiKey(storedApiKey);
    }, []);

    const handleSearch = async ({pageToken = '', firstTime = false }: HandleSearchProps = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL('http://localhost:3001/api/youtube');
            url.searchParams.append('query', query);
            if (pageToken) {
                url.searchParams.append('pageToken', pageToken);
            }
            if (apiKey) {
                url.searchParams.append('apiKey', apiKey);
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
            setPageToken(data.nextPageToken);
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
        apiKey,
        setApiKey,
        pageToken,
    };
};

export default useYouTubeSearch;
