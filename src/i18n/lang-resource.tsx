import pageLinkEn from './en/pageLink';
import downloadPageEn from './en/downloadPage'
import convertPageEn from './en/convertPage'

import pageLinkZh from './zh/pageLink';
import downloadPageZh from './zh/downloadPage';
import convertPageZh from './zh/convertPage'

const resources = {
    en: {
        // pageLink: pageLinkEn,
        // downloadPage: downloadPageEn,
        // convertPage: convertPageEn,
        common: {
            ...pageLinkEn,
            ...downloadPageEn,
            ...convertPageEn,
        },
    },
    zh: {
        // pageLink: pageLinkZh,
        // downloadPage: downloadPageZh,
        // convertPage: convertPageZh,
        common: {
            ...pageLinkZh,
            ...downloadPageZh,
            ...convertPageZh,
        },
    },
};

export default resources;
