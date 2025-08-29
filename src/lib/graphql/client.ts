import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';
import { defaultDatasourceQuery } from './generated';

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
}
