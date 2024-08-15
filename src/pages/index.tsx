import { LinkListDetail } from "@/components/common/linkList";
import HomeComponent from "@/components/home/homeComponent";
import Layout from "@/components/layout";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout title={t(LinkListDetail["/"].title)} content={t(LinkListDetail["/"].description)}>
      <HomeComponent />
    </Layout>
  )
}

export default HomePage;
