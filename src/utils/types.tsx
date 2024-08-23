import { Dispatch, SetStateAction } from "react";

interface Video {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        thumbnails: {
            default: {
                url: string;
                width: number;
                height: number;
            };
            medium?: {
                url: string;
                width: number;
                height: number;
            };
            high?: {
                url: string;
                width: number;
                height: number;
            };
            standard?: {
                url: string;
                width: number;
                height: number;
            };
            maxres?: {
                url: string;
                width: number;
                height: number;
            };
        };
    };
}

interface YoutubeCommonProps {
    videoUrl: string;
    setVideoUrl: Dispatch<SetStateAction<string>>;
}


interface SearchProps extends YoutubeCommonProps {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    showSearch: boolean;
    setShowSearch: Dispatch<SetStateAction<boolean>>;
}

interface ApiKeyInputProps {
    apiKey: string;
    setApiKey: Dispatch<SetStateAction<string>>;
}

interface SettingPanelProps extends ApiKeyInputProps {
    opened: boolean;
}


interface DownloadPanelProps extends YoutubeCommonProps {
    activePanel: string;
    setActivePanel: Dispatch<SetStateAction<boolean>>;
}

interface HandleSearchProps {
    pageToken?: string;
    firstTime?: boolean;
}

interface SearchResultProps {
    videos: Video[];
    setVideoUrl: Dispatch<SetStateAction<string>>;
}

export type { Video, YoutubeCommonProps, DownloadPanelProps, HandleSearchProps, ApiKeyInputProps, SearchResultProps, SearchProps, SettingPanelProps };
