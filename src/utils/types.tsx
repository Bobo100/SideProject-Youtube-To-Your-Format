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
            };
        };
    };
}

interface YoutubeCommonProps {
    videoUrl: string;
    setVideoUrl: Dispatch<SetStateAction<string>>;
}
interface DownloadPanelProps extends YoutubeCommonProps {
    activePanel: string;
    setActivePanel: Dispatch<SetStateAction<string>>;
}

export type { Video, YoutubeCommonProps, DownloadPanelProps };
