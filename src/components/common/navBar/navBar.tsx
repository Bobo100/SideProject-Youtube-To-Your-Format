import { Fragment, useEffect, useRef, useState } from "react"
import styles from "./navBar.module.scss"
import Link from "next/link"
import { useRouter } from "next/router"
import ThemeToggle from "@/components/theme/themeToggle"
import { useTheme } from "next-themes"
import { getThemeClassName } from "@/utils/commonFunction"
import { LinkList, LinkListDetail } from "../linkList"
import isEqual from "lodash/isEqual"
import useWindowWidth from "@/hooks/useWindowWidth"
const NavBar = () => {
    const router = useRouter()

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const { theme } = useTheme();
    const { width } = useWindowWidth();

    const linkContainerRef = useRef<HTMLDivElement>(null);

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

    const getLinkClassName = (path: string) => {
        const isHome = isEqual(path, '/');
        const isActive = isHome ? isEqual(router.pathname, path) :
            router.pathname.startsWith(path)
        const activeStyles = isEqual(theme, 'light') ? styles.active_light : styles.active_dark;
        return isActive ? activeStyles : '';
    };

    const getLink = ({ href, name, className }: { href: string, name: string, className?: string }) => {
        return (
            <Link href={`${href}`} className={`${styles.link} ${getThemeClassName('link', styles, theme)} ${getLinkClassName(`${className}`)}`}>{name}</Link>
        )
    }

    return (
        <nav id="navbar" className={`${styles.navbar} ${visible ? 'navbar--visible' : styles.navbar_Hidden} ${getThemeClassName('nav', styles, theme)}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.navbar_container}>
                <div className={styles.logo_container}>
                    <Link href={LinkListDetail["/"].href} className={styles.logo_title}>BOBO BLOG</Link>
                </div>
                <div className={`${styles.navbar_menu}`}>
                    <div className={`${styles.link_container} ${getThemeClassName('link_container', styles, theme)}`}
                        ref={linkContainerRef}
                    >
                        {LinkList.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    {getLink(item)}
                                </Fragment>
                            )
                        })}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default NavBar