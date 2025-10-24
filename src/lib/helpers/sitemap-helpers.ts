import { GraphQLClient } from 'lib/graphql/client';

type SitemapBuilderProps = {
  protocol: string;
  host: string;
  links: string[];
};

export const BuildCustomSitemapLinks = async (id: string): Promise<string[]> => {
  switch (id) {
    case 'Blogs':
      return await BuildBlogSitemap();
    case 'Products':
      return await BuildProductSitemap();
  }

  return [];
};

export const BuildSitemap = (props: SitemapBuilderProps): string => {
  const items = props.links.map((item) => {
    let parsed: URL | null = null;

    try {
      parsed = new URL(item, `${props.protocol}://${props.host}`);
    } catch (error) {
      // Ignore parse errors and fall back to original value.
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

const BuildBlogSitemap = async (): Promise<string[]> => {
  const templateId = '{06F3E1D0-920C-43C8-8CCA-701B2E2D3323}';
  const path = '{BAB22887-D110-4E28-B1E9-4386A825BCFD}';

  const blogs = await GraphQLClient.GetBucketItemsForSitemap(path, templateId);
  if (!blogs) {
    return [];
  }

  return blogs.map((p) => `blogs/${p.name}`);
};

type ProductApiResult = {
  name: string;
};
const BuildProductSitemap = async (): Promise<string[]> => {
  const products = await callProductApi();
  return products.map((p) => `shop/${p.name}`);
};

const callProductApi = async (): Promise<ProductApiResult[]> => {
  const exampleProductApiResult: ProductApiResult[] = [
    { name: 'product-1' },
    { name: 'product-2' },
    { name: 'product-3' },
  ];

  return Promise.resolve(exampleProductApiResult);
};
