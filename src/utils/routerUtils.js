import path from 'path';
import _omit from 'lodash/omit';

const isDocumentLink = (url) => {
  const regex = new RegExp(/\/document\/index\.html/);
  return regex.test(url);
};

const isMailToLink = (url) => {
  if (!url) return false;
  const regex = new RegExp(/mailto:/);
  return regex.test(url.toLowerCase());
};

const routerUtils = {
  push: (router, targetPath, otherQuery = {}, reload = false) => {
    const params = routerUtils.getPathnameQuery(router, targetPath, otherQuery);
    router.push(params).then(() => {
      reload && router.reload();
    });
  },
  replace: (router, targetPath, otherQuery = {}, asPath = undefined) => {
    const params = routerUtils.getPathnameQuery(router, targetPath, otherQuery);
    const { locale = '' } = params.query;
    asPath = asPath ? path.join(`/${locale}`, asPath) : asPath;
    router.replace(params, asPath);
  },
  shallowReplace: (router, otherQuery, as = undefined) => {
    router.replace(
      {
        pathname: router.pathname,
        query: otherQuery,
      },
      as,
      { shallow: true }
    );
  },
  shallowPush: (router, otherQuery, as = undefined) => {
    if (router?.query?.locale && as) {
      as = path.join('/', router.query.locale, as);
    }
    router.push(
      {
        pathname: router.pathname,
        query: otherQuery,
      },
      as,
      { shallow: true }
    );
  },
  getPathnameQuery: (router, targetPath, otherQuery = {}) => {
    let { locale = 'en-us' } = router.query;
    if (otherQuery.locale) {
      locale = otherQuery.locale;
    }
    if (isDocumentLink(targetPath) || isMailToLink(targetPath)) {
      return { pathname: targetPath, otherQuery };
    }
    if (targetPath.startsWith('/[locale]')) {
      targetPath = path.join('/', targetPath.replace('/[locale]', ''));
    }
    const pathname =
      locale === 'en-us' ? targetPath : path.join('/[locale]', targetPath);
    const query =
      locale === 'en-us'
        ? _omit(otherQuery, ['locale'])
        : { locale, ...otherQuery };
    return { pathname, query };
  },
  toCachedLocale: (router, cachedLocale) => {
    if (!cachedLocale) {
      return true;
    }
    let { pathname: targetPath } = router;
    const { locale = 'en-us', ...otherQuery } = router.query;
    if (targetPath.startsWith('/[locale]')) {
      targetPath = path.join('/', targetPath.replace('/[locale]', ''));
    }
    if (locale !== cachedLocale) {
      const pathname =
        cachedLocale === 'en-us'
          ? targetPath
          : path.join('/[locale]/', targetPath);
      const query =
        cachedLocale === 'en-us'
          ? otherQuery
          : { locale: cachedLocale, ...otherQuery };
      router.replace({ pathname, query });
      return false;
    } else {
      return true;
    }
  },
};

export default routerUtils;
