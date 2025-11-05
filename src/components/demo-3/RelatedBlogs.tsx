import {
    ComponentFields,
    ComponentRendering,
    Field,
    GetComponentServerProps,
    Item,
    LayoutServiceData,
    Text,
    useComponentProps,
    withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { isServerSidePropsContext } from '@sitecore-content-sdk/nextjs/utils';
import { ComponentProps } from 'lib/component-props';
import { GraphQLClient } from 'lib/graphql/client';
import { JSX } from 'react';
import { RelatedBlog } from 'src/types/demo-3/related-blog';

type BlogPage = Item & {
    itemId: string;
    fields: {
        Title: Field<string>;
        Category: {
            id: string;
        };
    };
};

type LayoutData = LayoutServiceData & {
    sitecore: {
        route: BlogPage;
    };
};

type RelatedBlogsDatasource = ComponentRendering<ComponentFields> & {
    id: string;
    name: string;
    fields: {
        StartSearchLocation: Item;
        Title: Field<string>;
    };
};

type RelatedBlogsProps = ComponentProps & {
    rendering: RelatedBlogsDatasource;
};

const Default = (props: RelatedBlogsProps): JSX.Element => {
    const id = props.params.RenderingIdentifier;
    const relatedBlogs = useComponentProps<RelatedBlog[]>(props.rendering.uid);

    return (
        <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
            <div className="component-content container py-4">
                <div className="row mb-4">
                    <div className="col">
                        <Text
                            tag="h2"
                            field={props.rendering?.fields.Title}
                            className="h4 fw-bold"
                        />
                    </div>
                </div>
                <div className="row g-4">
                    {relatedBlogs &&
                        relatedBlogs.map((rb, i) => (
                            <div className="col-lg-4 col-md-6" key={`related-blog-${i}`}>
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={rb.image.jsonValue.value?.src}
                                        className="card-img-top img-fluid"
                                        alt={rb.title.value}
                                        style={{ objectFit: 'cover', height: '200px' }}
                                    />
                                    <div className="card-body">
                                        <a
                                            href={rb.urlWrapper.url}
                                            className="stretched-link text-decoration-none"
                                        >
                                            <Text
                                                field={rb.title}
                                                tag="h5"
                                                className="card-title mb-0"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export const getComponentServerProps: GetComponentServerProps = async (
    rendering: RelatedBlogsDatasource,
    layoutData: LayoutData,
    context
) => {
    if (isServerSidePropsContext(context)) {
        const currentBlogId = layoutData.sitecore.route?.itemId;
        const currentCategoryId = layoutData.sitecore.route.fields?.Category?.id;
        const startSearchLocation = rendering.fields?.StartSearchLocation?.id as string;

        if (!currentBlogId || !currentCategoryId || !startSearchLocation) {
            return Promise.resolve({});
        }

        const relatedBlogs = await GraphQLClient.GetRelatedBlogs(
            startSearchLocation,
            currentBlogId,
            currentCategoryId
        );

        return relatedBlogs;
    }

    return Promise.resolve({});
};

export default withDatasourceCheck()<ComponentProps>(Default);
