import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { extractFiles, generateMetadata, generateSites } from '@sitecore-content-sdk/nextjs/tools';
import { generateQueries } from 'commands/generate-queries';
import { generateScaffoldedTemplates } from 'commands/generate-templates';
import { templates } from 'templates/generated';
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
      generateScaffoldedTemplates({
        templatePath: 'templates',
        outputPath: 'templates/generated.ts',
      }),
    ],
  },
  scaffold: {
    templates,
  },
  componentMap: {
    paths: ['src/components'],
    // Exclude content-sdk auxillary components
    exclude: ['src/components/content-sdk/*'],
  },
});
