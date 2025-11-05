import scConfig from 'sitecore.config';
import { IdkSitecoreClient } from './client/sitecore-client';

// Promote the extended client (with sitemap overrides) so API routes can reuse the shared config.
const client = new IdkSitecoreClient({
    ...scConfig,
});

export default client;
