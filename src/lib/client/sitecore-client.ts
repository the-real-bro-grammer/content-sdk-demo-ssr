import {
  FetchOptions,
  SitecoreClientInit,
  SitemapXmlOptions,
} from '@sitecore-content-sdk/core/client';
import { NativeDataFetcher } from '@sitecore-content-sdk/nextjs';
import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import {
  BuildCustomSitemapLinks,
  BuildSitemap,
  BuildSitemapIndex as buildSitemapIndex,
} from 'lib/helpers/sitemap-helpers';

export class IdkSitecoreClient extends SitecoreClient {
  constructor(protected initOptions: SitecoreClientInit) {
    super(initOptions);
  }

  override async getSiteMap(
    reqOptions: SitemapXmlOptions,
    fetchOptions?: FetchOptions
  ): Promise<string> {
    const { reqHost, reqProtocol, id, siteName } = reqOptions;

    // create sitemap graphql service
    const sitemapXmlService = this.getGraphqlSitemapXMLService(
      siteName || this.initOptions.defaultSite
    );

    const allSitemaps = await sitemapXmlService.fetchSitemaps(fetchOptions);
    let sitemap = '';
    if (!id) {
      const mainSitemapLinks = allSitemaps.map(
        (_, i) => `${reqProtocol}://${reqHost}/sitemapMain-${i}.xml`
      );

      sitemap = buildSitemapIndex({
        host: reqHost,
        protocol: reqProtocol as string,
        links: [
          ...mainSitemapLinks,
          `${reqProtocol}://${reqHost}/sitemapProducts.xml`,
          `${reqProtocol}://${reqHost}/sitemapBlogs.xml`,
        ],
      });
    } else if (id.includes('Main')) {
      const sitemapIndex = parseInt(id[id.length - 1]);
      const sitemapUrl = allSitemaps[sitemapIndex];
      const fetcher = new NativeDataFetcher();
      const xmlResponse = await fetcher.fetch<string>(sitemapUrl);
      if (!xmlResponse.data) {
        throw new Error('REDIRECT_404');
      }

      sitemap = xmlResponse.data;
    } else {
      const sitemapValues = await BuildCustomSitemapLinks(id as string);
      if (sitemapValues == null) {
        throw new Error('REDIRECT_404');
      }

      sitemap = BuildSitemap({
        host: reqHost,
        protocol: reqProtocol as string,
        links: sitemapValues,
      });
    }

    return sitemap;
  }
}
