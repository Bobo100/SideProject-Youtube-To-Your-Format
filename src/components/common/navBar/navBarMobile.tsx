import { Fragment, useEffect, useRef, useState } from "react"
import styles from "./navBarMobile.module.scss"
import Link from "next/link"
import ThemeToggle from "@/components/theme/themeToggle"
import { useTheme } from "next-themes"
import { getThemeClassName } from "@/utils/commonFunction"
import { useScrollLock } from "@/hooks/useScrollLock"
import { LinkList, LinkListDetail } from "../linkList"
import useWindowDevice from "@/hooks/useWindowDevice"
import useWindowWidth from "@/hooks/useWindowWidth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';
import I18nSelector from "../i18nSelector/i18nSelector"
import { useTranslation } from "react-i18next"
import usePageGeneral from "@/hooks/usePageGeneral"
import UseNavBarCommon from "./hooks/useNavBarCommon"

const NavBarMobile = () => {
    const { theme } = useTheme();
    const { width } = useWindowWidth();
    const { isDesktop } = useWindowDevice();
    const { t } = useTranslation();
    const { isHomePage } = usePageGeneral();
    const { getLink, visible, handleSettingClick } = UseNavBarCommon();
    const { lockScroll, unlockScroll } = useScrollLock('navbar_mobile');

    const [click, setClick] = useState(false);

    const linkContainerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleIconClick = () => {
        if (width < 1024 && click) {
            unlockScroll();
        }
        else if (width < 1024 && !click) {
            lockScroll();
        }
        setClick(!click);
    }

    useEffect(() => {
        const handleResize = () => {
            if (width > 1024) {
                unlockScroll();
                setClick(false);
            }
        };
        handleResize();
    }, [width]);

    useEffect(() => {
        const closeNavbar = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest(`.${styles.mobile_icon}`)) return;
            if (!target.closest(`.${styles.link_container}`)) {
                setClick((prevClick) => {
                    if (prevClick) {
                        unlockScroll();
                    }
                    return false;
                });
            }
        };

        window.addEventListener('click', closeNavbar, true);

        return () => {
            window.removeEventListener('click', closeNavbar, true);
        };
    }, [click]);


    const mobileClose = () => {
        if (width < 1024) {
            setClick(false);
            unlockScroll();
        }
    }

    if (isDesktop) return null;

    return (
        <nav id="navbar_mobile" className={`${styles.navbar} ${visible ? 'navbar--visible' : styles.navbar_Hidden} ${getThemeClassName('nav', styles, theme)}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.navbar_container}>
                <div className={styles.logo_container}>
                    <Link href={LinkListDetail["/"].href} className={styles.logo_title}>{t('appTitle')}</Link>
                </div>
                <div className="flex items-center">
                    {isHomePage && <button className={styles.settingButton}
                        onClick={handleSettingClick}
                    >{t('setting')}</button>}
                    <div className={`${styles.mobile_icon} ${getThemeClassName('mobile_icon', styles, theme)}`} onClick={handleIconClick}>
                        {click ? <FontAwesomeIcon icon={fas.faTimes} /> : <FontAwesomeIcon icon={fas.faBars} />}
                    </div>
                </div>
                <div className={`${styles.navbar_menu} ${click ? styles.navbar_menu_active : ''}`}>
                    <div className={`${styles.link_container} ${getThemeClassName('link_container', styles, theme)} ${click ? styles.link_container_active : ''}`}
                        ref={linkContainerRef}
                    >
                        {LinkList.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    {getLink({ ...item, styles, onClick: mobileClose })}
                                </Fragment>
                            )
                        })}
                        <ThemeToggle />
                        <I18nSelector />
                    </div>
                    <div ref={overlayRef}
                        className={`${click ? `${styles.overlay} ${getThemeClassName('overlay', styles, theme)}` : ''}`}
                    ></div>
                </div>
            </div>
        </nav >
    )
}

export default NavBarMobile