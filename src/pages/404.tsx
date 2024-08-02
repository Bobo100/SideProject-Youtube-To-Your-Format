import { LinkListDetail } from "@/components/common/linkList";
import Layout from "@/components/layout";

const Custom404 = () => {
    return (
        <Layout title={LinkListDetail["/404"].title} content={LinkListDetail["/404"].description}>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="text-xl">Page Not Found</p>
            </div>
        </Layout>
    )
};


export default Custom404;
