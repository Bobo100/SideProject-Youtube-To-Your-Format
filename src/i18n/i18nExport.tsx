const config = {
    locale: ['zh', 'en'],
    defaultLocale: 'zh',
};

const generateLocaleSlugs = () => {
    return config.locale.map((locale) => ({
        params: {
            locale,
        },
    }));
};

async function getStaticPaths() {
    return {
        paths: generateLocaleSlugs(),
        fallback: false,
    };
}

async function getStaticProps(props: any) {
    const { params } = props;
    return {
        props: {
            ...params,
        },
    };
}

export { getStaticPaths, getStaticProps };