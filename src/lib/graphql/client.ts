import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';
import { RelatedBlog } from 'src/types/demo-3/related-blog';
import { SitemapData } from 'src/types/demo-4/sitemap-data';
import { SearchResults } from 'src/types/search-results';
import { defaultDatasourceQuery, getAllBucketItemsQuery, relatedBlogsQuery } from './generated';

export class GraphQLClient {
  private static graphqlendpoint = `https://${scConfig.api.local.apiHost}/sitecore/api/graph/edge`;
  private static graphQLClient = new GraphQLRequestClient(GraphQLClient.graphqlendpoint, {
    apiKey: scConfig.api.local.apiKey,
  });

  public static GetDefaultDataSource = async (
    datasource: string,
    contextItem: string,
    language: string
  ) => {
    const response = await GraphQLClient.graphQLClient.request(defaultDatasourceQuery, {
      datasource,
      contextItem,
      language,
    });

    return response;
  };

  public static GetRelatedBlogs = async (
    blogContainerId: string,
    currentBlogId: string,
    categoryId: string
  ) => {
    const response = await GraphQLClient.graphQLClient.request<SearchResults<RelatedBlog>>(
      relatedBlogsQuery,
      {
        startSearchLocation: blogContainerId,
        currentBlog: currentBlogId,
        category: categoryId,
      }
    );

    return response.searchResults.results;
  };

  public static GetBucketItemsForSitemap = async (
    path: string,
    template: string
  ): Promise<SitemapData[]> => {
    const response = await GraphQLClient.graphQLClient.request<SearchResults<SitemapData>>(
      getAllBucketItemsQuery,
      {
        path,
        template,
      }
    );

    return response?.searchResults?.results;
  };
}
