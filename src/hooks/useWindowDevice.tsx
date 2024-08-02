import variables from '@/styles/variables.module.scss';
import useWindowWidth from './useWindowWidth';
import { useMemo } from 'react';

export default function useWindowDevice() {
    const { width } = useWindowWidth();

    const isDesktop = useMemo(() => {
        return width > 1024;
    }, [width]);

    const isMobile = useMemo(() => {
        return width <= 640
    }, [width]);

    const isPad = useMemo(() => {
        return !isDesktop && !isMobile;
    }, [isDesktop, isMobile]);

    return {
        isDesktop,
        isMobile,
        isPad,
    };
}
