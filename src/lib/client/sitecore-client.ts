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

// Custom Sitecore client that augments the stock sitemap handling so we can layer in
// bespoke sitemap documents (blogs/products) alongside the XM generated ones.
export class IdkSitecoreClient extends SitecoreClient {
  constructor(protected initOptions: SitecoreClientInit) {
    super(initOptions);
  }

  override async getSiteMap(
    reqOptions: SitemapXmlOptions,
    fetchOptions?: FetchOptions
  ): Promise<string> {
    const { reqHost, reqProtocol, id, siteName } = reqOptions;

    // Use the default GraphQL sitemap service as our baseline for XM-managed routes.
    const sitemapXmlService = this.getGraphqlSitemapXMLService(
      siteName || this.initOptions.defaultSite
    );

    const allSitemaps = await sitemapXmlService.fetchSitemaps(fetchOptions);
    let sitemap = '';
    if (!id) {
      // No id means the browser requested the root sitemap. Surface an index that references the
      // XM generated child sitemaps along with the custom ones we publish locally.
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
      const sitemapIndexMatch = id.match(/Main-(\d+)$/);
      const sitemapIndex = sitemapIndexMatch ? parseInt(sitemapIndexMatch[1], 10) : Number.NaN;
      if (Number.isNaN(sitemapIndex)) {
        throw new Error('REDIRECT_404');
      }

      const sitemapUrl = allSitemaps[sitemapIndex];
      if (!sitemapUrl) {
        throw new Error('REDIRECT_404');
      }

      const fetcher = new NativeDataFetcher();
      const xmlResponse = await fetcher.fetch<string>(sitemapUrl);
      if (!xmlResponse.data) {
        throw new Error('REDIRECT_404');
      }

      sitemap = xmlResponse.data;
    } else {
      // Remaining ids map to our custom sitemap implementations (currently Blogs and Products).
      const sitemapValues = await BuildCustomSitemapLinks(id as string);
      // Null signals an unsupported sitemap flavour; allow empty arrays so we can return an
      // empty but correctly shaped sitemap document when no items exist yet.
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
