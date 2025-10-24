import { GraphQLClient } from 'lib/graphql/client';

type SitemapBuilderProps = {
  protocol: string;
  host: string;
  links: string[];
};

// Entry point for resolving the link list backing each bespoke sitemap document (blogs/products).
export const BuildCustomSitemapLinks = async (id: string): Promise<string[] | null> => {
  switch (id) {
    case 'Blogs':
      return await BuildBlogSitemap();
    case 'Products':
      return await BuildProductSitemap();
    default:
      return null;
  }
};

// Build a traditional sitemap.xml response by normalising each link into an absolute <loc>.
export const BuildSitemap = (props: SitemapBuilderProps): string => {
  const items = props.links.map((item) => {
    let parsed: URL | null = null;

    try {
      parsed = new URL(item, `${props.protocol}://${props.host}`);
    } catch (error) {
      // Ignore parse errors and fall back to the original value so we still emit something.
    }

    const lastSegment = parsed ? parsed.pathname.replace(/^\//, '') : item;

    return `<url>
        <loc>${props.protocol}://${props.host}/${lastSegment}</loc>
      </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join('')}
</urlset>`;
};

// Compose a sitemap index, ensuring every entry resolves to a fully qualified URL.
export const BuildSitemapIndex = (props: SitemapBuilderProps): string => {
  const items = props.links.map((item) => {
    let parsed: URL | null = null;

    try {
      parsed = new URL(item, `${props.protocol}://${props.host}`);
    } catch (error) {
      throw new Error('REDIRECT_404');
    }

    const lastSegment = parsed ? `${parsed.pathname.replace(/^\//, '')}` : item;
    const fullPath = `${props.protocol}://${props.host}/${lastSegment}`;

    return `<sitemap>
        <loc>${fullPath}</loc>
      </sitemap>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join('')}
</sitemapindex>`;
};

// Fetch Sitecore blog items from the bucket used by the XM demo template and surface friendly paths.
const BuildBlogSitemap = async (): Promise<string[]> => {
  const templateId = '{06F3E1D0-920C-43C8-8CCA-701B2E2D3323}';
  const path = '{BAB22887-D110-4E28-B1E9-4386A825BCFD}';

  const blogs = await GraphQLClient.GetBucketItemsForSitemap(path, templateId);
  if (!blogs?.length) {
    return [];
  }

  return blogs.map((p) => `blogs/${p.name}`);
};

type ProductApiResult = {
  name: string;
};

// Derive product detail URLs from the external commerce feed.
const BuildProductSitemap = async (): Promise<string[]> => {
  const products = await callProductApi();
  if (!products?.length) {
    return [];
  }

  return products.map((p) => `shop/${p.name}`);
};

// Temporary stub that simulates a product API integration. Swap this for the real call when ready.
const callProductApi = async (): Promise<ProductApiResult[]> => {
  const exampleProductApiResult: ProductApiResult[] = [
    { name: 'product-1' },
    { name: 'product-2' },
    { name: 'product-3' },
  ];

  return Promise.resolve(exampleProductApiResult);
};
