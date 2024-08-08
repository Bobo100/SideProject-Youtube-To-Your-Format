import Head from "next/head";
import NavBar from "./common/navBar/navBar";
import NavBarMobile from "./common/navBar/navBarMobile";
import styles from "./layout.module.scss";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ogTypes } from "@/utils/variablesUtils";
import '../i18n/i18n';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  content?: string;
  image?: string;
  ogType?: string;
}
export default function Layout({ children, title, content, image, ogType }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      document.querySelector('.progress_bar')?.classList.add(styles.progress_bar_active);
    };

    const handleRouteChangeComplete = () => {
      document.querySelector('.progress_bar')?.classList.remove(styles.progress_bar_active);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);

  if (!mounted) {
    return null;
  }

  return (
    <div id="layout"
      className={`${styles.container} ${theme === 'light' ? styles.container_light : styles.container_dark}`} >
      <Head>
        {/* https://stackoverflow.com/questions/44752189/how-to-add-font-awesome-to-next-js-project */}
        {/* <script
                    // you might need to get a newer version
                    src="https://kit.fontawesome.com/fbadad80a0.js"
                    crossOrigin="anonymous"
                ></script> */}
        <title key="title">{title ? title : "YouTube to Your Format Converter"}</title>
        <meta name="title" content={title ? title : "YouTube to Your Format Converter"} />
        <meta name="description"
          content={content ? content : "YouTube to Your Format Converter"}
          key="description" />
        <meta name="image" content={image} />
        {/* 用來定義網頁的 Open Graph (OG) 屬性，用於在社交媒體平台上分享時提供更好的預覽效果 */}
        <meta name="og:title" property="og:title" content={title ? title : "YouTube to Your Format Converter"} />
        <meta name="og:type" property="og:type" content={ogType ? ogType : ogTypes.website} />
        <meta
          name="og:url"
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_WEBSITE_URL}${router.asPath}`}
        />
        <meta
          name="og:description"
          property="og:description"
          content={content ? content : "YouTube to Your Format Converter"}
        />
        <meta name="og:image" property="og:image" content={image} />
        {/* canonical */}
        <link rel="canonical" key="canonical" href={router.asPath} />
      </Head>
      <div className={`progress_bar ${styles.progress_bar}`} />
      <NavBar />
      <NavBarMobile />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}