import { Page } from '@sitecore-content-sdk/nextjs';
import { getBasicMetadata, Metadata } from '.';

type BlogMetadata = Metadata & {};

export const getBlogMetadata = (page: Page): BlogMetadata | null => {
  const routeData = page.layout.sitecore.route;
  const basicMetadata = getBasicMetadata(page);
  if (!routeData || !basicMetadata) {
    return null;
  }

  return {
    ...basicMetadata,
  };
};
