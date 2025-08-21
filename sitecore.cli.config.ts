import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { extractFiles, generateMetadata, generateSites } from '@sitecore-content-sdk/nextjs/tools';
import { generateQueries } from 'commands/generate-queries';
import config from './sitecore.config';

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        scConfig: config,
      }),
      extractFiles({
        scConfig: config,
      }),
      generateQueries({
        queryPath: 'queries',
        outputPath: 'src/lib/graphql/generated.ts',
      }),
    ],
  },
  scaffold: {
    templates: [],
  },
  componentMap: {
    paths: ['src/components'],
    // Exclude content-sdk auxillary components
    exclude: ['src/components/content-sdk/*'],
  },
});
