import { GetComponentServerProps, Text, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { GraphQLClient } from 'lib/graphql/client';
import { JSX } from 'react';

type Demo2GeneratedTemplateProps = ComponentProps & {
  data: {
    datasource: {
      id: string;
      name: string;
      title: {
        value: string;
      };
      children: {
        results: {
          title: {
            value: string;
          };
        }[];
      };
    };
    contextItem: {
      id: string;
      name: string;
      title: {
        value: string;
      };
      navTitle: {
        value: string;
      };
    };
  };
};

const Default = (props: Demo2GeneratedTemplateProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <Text tag="h2" field={props.data.contextItem.title} />
        <div className="component-datasource-header">
          <Text tag="h3" field={props.data.datasource.title} />
        </div>
      </div>
    </div>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const result = await GraphQLClient.GetDefaultDataSource(
    rendering.dataSource as string,
    layoutData?.sitecore?.route?.itemId as string,
    layoutData?.sitecore?.context?.language as string
  );
  return result;
};

export default withDatasourceCheck()<ComponentProps>(Default);
