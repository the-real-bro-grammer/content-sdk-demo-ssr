import { Page } from '@sitecore-content-sdk/nextjs';
import { getBasicMetadata, Metadata } from '.';

type ProductMetadata = Metadata & {};

export const getProductMetadata = (page: Page): ProductMetadata | null => {
    const routeData = page.layout.sitecore.route;
    const basicMetadata = getBasicMetadata(page);
    if (!routeData || !basicMetadata) {
        return null;
    }

    return {
        ...basicMetadata,
    };
};
