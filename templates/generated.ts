import { ScaffoldTemplate } from "@sitecore-content-sdk/core/types/config/models";
  export const templates: ScaffoldTemplate[] = [{
        name: "MySecondTemplate",
        generateTemplate: (componentName: string) => {
            return `import { GetComponentServerProps, Text, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { GraphQLClient } from 'lib/graphql/client';
import { JSX } from 'react';

type ${componentName}Props = ComponentProps & {
    data: {
        datasource: {
            id: string;
            name: string;
            title: {
                value: string;
            };
            children: {
                results: any[];
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

const Default = (props: ${componentName}Props): JSX.Element => {
    const id = props.params.RenderingIdentifier;

    return (
        <div className={\`component ` + '${props.params.styles}' + `\`} id={id ? id : undefined}>
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
`
        },
        getNextSteps: (_componentOutputPath: string) => {
            return []
        },
        fileExtension: "tsx"
    },{
        name: "MyTemplate",
        generateTemplate: (componentName: string) => {
            return `import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

interface ${componentName}Props {
    rendering: ComponentRendering & { params: ComponentParams };
    params: ComponentParams;
}

export const Default = (props: ${componentName}Props): JSX.Element => {
    const id = props.params.RenderingIdentifier;

    return (
        <div className={\`component ` + '${props.params.styles}' + `\`} id={id ? id : undefined}>
            <div className="component-content">
                <p>MyComponent Component</p>
            </div>
        </div>
    );
};
`
        },
        getNextSteps: (_componentOutputPath: string) => {
            return []
        },
        fileExtension: "tsx"
    },]