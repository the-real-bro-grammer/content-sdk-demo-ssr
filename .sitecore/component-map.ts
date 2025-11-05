// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
import * as Demo2GeneratedTemplate from 'src/components/Demo2GeneratedTemplate';
import * as ProductExample from 'src/components/demo-4/ProductExample';
import * as RelatedBlogs from 'src/components/demo-3/RelatedBlogs';
import * as GraphQlDemo from 'src/components/demo-1/GraphQlDemo';
import * as RichText from 'src/components/converted-from-jss/RichText';
import * as PartialDesignDynamicPlaceholder from 'src/components/converted-from-jss/PartialDesignDynamicPlaceholder';
import * as Navigation from 'src/components/converted-from-jss/Navigation';
import * as Container from 'src/components/converted-from-jss/Container';


// Components must be registered within the map to match the string key with component name in Sitecore
export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Demo2GeneratedTemplate', Demo2GeneratedTemplate],
  ['ProductExample', ProductExample],
  ['RelatedBlogs', RelatedBlogs],
  ['GraphQlDemo', GraphQlDemo],
  ['RichText', RichText],
  ['PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholder],
  ['Navigation', Navigation],
  ['Container', Container],
]);

export default componentMap;
