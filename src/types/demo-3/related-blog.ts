import { Field, ImageField, Item } from '@sitecore-content-sdk/nextjs';

export type RelatedBlog = Item & {
    title: Field<string>;
    urlWrapper: {
        url: string;
    };
    image: {
        jsonValue: ImageField;
    };
};
