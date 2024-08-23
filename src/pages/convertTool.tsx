import { LinkListDetail } from "@/components/common/linkList";
import ConvertToolComponent from "@/components/convertTool/convertToolComponent";
import Layout from "@/components/layout";
import { useTranslation } from "react-i18next";
import { getStaticProps } from '@/i18n/i18nExport';

function ConvertToolPage() {
  const { t } = useTranslation();

  return (
    <Layout title={t(LinkListDetail["convertTool"].title)} content={t(LinkListDetail["convertTool"].description)}>
      <ConvertToolComponent />
    </Layout>
  )
}

export default ConvertToolPage;
export { getStaticProps };
