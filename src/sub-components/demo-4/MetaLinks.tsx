import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { getPageMetadata } from 'lib/helpers/metadata';

const Default = () => {
    const { page } = useSitecore();

    const metadata = getPageMetadata(page);
    if (!metadata) {
        return <></>;
    }

    return (
        <>
            {Object.entries(metadata).map(([k, v], i) => {
                return <meta name={k} content={v} key={`metadata-${i}`} data-next-head />;
            })}
        </>
    );
};

export default Default;
