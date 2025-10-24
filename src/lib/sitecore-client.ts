import scConfig from 'sitecore.config';
import { IdkSitecoreClient } from './client/sitecore-client';

const client = new IdkSitecoreClient({
  ...scConfig,
});

export default client;
