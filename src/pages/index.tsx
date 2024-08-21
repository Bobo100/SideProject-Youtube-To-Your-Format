import { LinkListDetail } from "@/components/common/linkList";
import HomeComponent from "@/components/home/homeComponent";
import Layout from "@/components/layout";
import { useTranslation } from "react-i18next";
import { getStaticProps } from '@/i18n/i18nExport';

function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout title={t(LinkListDetail["/"].title)} content={t(LinkListDetail["/"].description)}>
      <HomeComponent />
    </Layout>
  )
}

export default HomePage;
export { getStaticProps };
