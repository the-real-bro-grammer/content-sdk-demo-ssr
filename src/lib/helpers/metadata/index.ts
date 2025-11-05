import { Field, Page } from '@sitecore-content-sdk/nextjs';
import { CONSTANTS } from '../constants';
import { formatListingID } from '../item-helpers';
import { getBlogMetadata } from './blog-metadata';
import { getProductMetadata } from './product-metadata';

export type Metadata = {
    idk_id: string;
    idk_template: string;
    idk_thumbnail_image_url: string;
    idk_meta_title: string;
    idk_description: string;
    clickableuri?: string;
};

export const getPageMetadata = (page: Page): Record<string, string> => {
    const routeData = page.layout.sitecore.route;

    const templateId = formatListingID(routeData?.templateId as string);
    let metadata: Record<string, string> | null;

    switch (templateId) {
        case CONSTANTS.TEMPLATES.PAGES.BLOG_DETAIL.ID:
            metadata = getBlogMetadata(page);
            break;
        case CONSTANTS.TEMPLATES.PAGES.PRODUCT_DETAIL.ID:
            metadata = getProductMetadata(page);
            break;
        default:
            metadata = getBasicMetadata(page);
            break;
    }

    if (!metadata) {
        return {};
    }

    const sanitizedMetadata = sanitizeMetadata(metadata);
    return sanitizedMetadata;
};

export const getBasicMetadata = (page: Page): Metadata | null => {
    const routeData = page.layout.sitecore.route;
    if (!routeData) {
        return null;
    }

    const imageUrl = '';
    const id = formatListingID(routeData.itemId as string);
    const templateId = formatListingID(routeData.templateId as string);
    const metaTitle = routeData.fields?.['Meta Title'] as unknown as Field<string>;
    const metaDescription = routeData.fields?.['Meta Description'] as unknown as Field<string>;

    return {
        idk_id: id,
        idk_template: templateId,
        idk_thumbnail_image_url: imageUrl,
        idk_meta_title: metaTitle?.value,
        idk_description: metaDescription?.value,
    };
};

const sanitizeMetadata = (metadata: Record<string, string | undefined>): Record<string, string> => {
    return Object.entries(metadata).reduce<Record<string, string>>((acc, [key, value]) => {
        if (typeof value === 'string') {
            acc[key] = value.trim();
        }

        return acc;
    }, {});
};
