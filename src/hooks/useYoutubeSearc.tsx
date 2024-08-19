import { useState } from 'react';

const useYouTubeSearch = () => {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            setError(error.message);
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
