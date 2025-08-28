import { ScaffoldTemplate } from '@sitecore-content-sdk/core/types/config/models';
export const templates: ScaffoldTemplate[] = [
  {
    name: 'MySecondTemplate',
    generateTemplate: (_componentName: string) => {
      return (
        `import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

interface MyComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: MyComponentProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={\`component ` +
        '${props.params.styles}' +
        `\`} id={id ? id : undefined}>
      <div className="component-content">
        <p>MyComponent Component</p>
      </div>
    </div>
  );
};
`
      );
    },
    getNextSteps: (_componentOutputPath: string) => {
      return [];
    },
    fileExtension: 'tsx',
  },
  {
    name: 'MyTemplate',
    generateTemplate: (_componentName: string) => {
      return (
        `import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

interface MyComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: MyComponentProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={\`component ` +
        '${props.params.styles}' +
        `\`} id={id ? id : undefined}>
      <div className="component-content">
        <p>MyComponent Component</p>
      </div>
    </div>
  );
};
`
      );
    },
    getNextSteps: (_componentOutputPath: string) => {
      return [];
    },
    fileExtension: 'tsx',
  },
];
