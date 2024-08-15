// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './lang-resource';

i18n
    .use(initReactI18next)  // 初始化設定
    .init({
        resources,            // 引入定義語系與對應文字的 json 檔
        lng: 'zh',            // 預設語系為 en
        fallbackLng: 'zh',    // 若找不到對應語系則回傳 en
        defaultNS: 'common',
        preload: ['en', 'zh'],
        ns: 'common',
        interpolation: {
            escapeValue: false,
        },
        parseMissingKeyHandler: () => {
            return '';
        },
        react: {
            useSuspense: false
        },
    });

if (typeof window !== 'undefined') {
    window.i18n = i18n;
}

export default i18n;