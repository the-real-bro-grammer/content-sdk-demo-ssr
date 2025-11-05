import { Field, RichText } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

interface Fields {
    Text: Field<string>;
}

export type RichTextProps = {
    params: { [key: string]: string };
    fields: Fields;
};

export const Default = (props: RichTextProps): JSX.Element => {
    const text = props.fields ? (
        <RichText field={props.fields.Text} />
    ) : (
        <span className="is-empty-hint">Rich text</span>
    );
    const id = props.params.RenderingIdentifier;

    return (
        <div
            className={`component rich-text ${props?.params?.styles.trimEnd()}`}
            id={id ? id : undefined}
        >
            <div className="component-content">{text}</div>
        </div>
    );
};
