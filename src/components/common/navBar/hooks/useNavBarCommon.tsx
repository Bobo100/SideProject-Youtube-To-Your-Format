import { useRouter } from 'next/router';
import isEqual from "lodash/isEqual";
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { getThemeClassName } from "@/utils/commonFunction"
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import useWindowWidth from '@/hooks/useWindowWidth';
import { useAppDispatch } from "@/redux/hook/hook";
import { setSettingModalOpen } from "@/redux/slice/settingSlice";

const UseNavBarCommon = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { width } = useWindowWidth();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const visible = prevScrollPos >= currentScrollPos;
            if (width < 1024) {
                setVisible(true);
                setPrevScrollPos(currentScrollPos);
                return;
            }

            setPrevScrollPos(currentScrollPos);
            setVisible(visible);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos, visible]);

    const getLinkClassName = (path: string, styles: any) => {
        const isHome = isEqual(path, '/');
        const isActive = isHome ? isEqual(router.pathname, path) :
            router.pathname.startsWith(path)
        const activeStyles = isEqual(theme, 'light') ? styles.active_light : styles.active_dark;
        return isActive ? activeStyles : '';
    };

    const getLink = ({ href, name, className, styles, onClick }: { href: string, name: string, className?: string, styles: any, onClick?: () => void }) => {
        return (
            <Link href={`${href}`}
                className={`${styles.link} ${getThemeClassName('link', styles, theme)} ${getLinkClassName(`${className}`, styles)}`}
                onClick={onClick}
            >
                {t(name)}
            </Link>
        )
    }

    const handleSettingClick = () => {
        dispatch(setSettingModalOpen(true));
    }

    return {
        getLinkClassName,
        getLink,
        prevScrollPos,
        setPrevScrollPos,
        visible,
        setVisible,
        handleSettingClick
    }

}

export default UseNavBarCommon;

