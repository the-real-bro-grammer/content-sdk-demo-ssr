import { ComponentRendering, Placeholder } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

type DynamicPlaceholderProps = {
    rendering: ComponentRendering;
};

const PartialDesignDynamicPlaceholder = (props: DynamicPlaceholderProps): JSX.Element => (
    <Placeholder name={props.rendering?.params?.sig || ''} rendering={props.rendering} />
);

export default PartialDesignDynamicPlaceholder;
