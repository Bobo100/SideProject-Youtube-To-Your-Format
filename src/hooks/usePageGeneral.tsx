import { useMemo } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';

export default function usePageGeneral() {
    const router = useRouter();
    const isHomePage = useMemo(() => {
        if (!router.isReady) {
            return false;
        }
        const homePageReg = new RegExp(/\/(zh|en)?\/?$/); // home page只有'/' 或是 '/zh' '/en'等等
        return homePageReg.test(router.pathname);
    }, [router.isReady, router.pathname]);

    return {
        isHomePage,
    };
}
