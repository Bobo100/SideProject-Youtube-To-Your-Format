import { LinkListDetail } from "@/components/common/linkList";
import HomeComponent from "@/components/home/homeComponent";
import Layout from "@/components/layout";

function HomePage() {

  return (
    <Layout title={LinkListDetail["/"].title} content={LinkListDetail["/"].description}>
      <HomeComponent />
    </Layout>
  )
}

export default HomePage;
