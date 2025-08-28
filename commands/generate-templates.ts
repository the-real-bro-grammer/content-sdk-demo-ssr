import fs from 'fs';
import path from 'path';

const generateScaffoldTemplate = (fileName: string, contents: string): string => {
  contents = contents.replaceAll('`', '\\`');
  contents = contents.replaceAll(/\$\{([^}]+)\}/g, "` + '${$1}' + `");

  return `{
        name: "${fileName}",
        generateTemplate: (_componentName: string) => {
            return \`${contents}\`
        },
        getNextSteps: (_componentOutputPath: string) => {
            return []
        },
        fileExtension: "tsx"
    },`;
};

const generateTemplatesWrapper = (templates: string): string => {
  return `import { ScaffoldTemplate } from "@sitecore-content-sdk/core/types/config/models";
  export const templates: ScaffoldTemplate[] = [${templates}]`;
};

type GenerateQueriesProps = {
  templatePath: string;
  outputPath: string;
};

export const generateScaffoldedTemplates = ({
  templatePath,
  outputPath,
}: GenerateQueriesProps): (() => Promise<void>) => {
  return async () => {
    fs.readdir(templatePath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      let templates = '';

      for (const file of files) {
        if (file.indexOf('tsx') < 0) {
          continue;
        }

        const fileName = file.split('.tsx')[0];
        const absolutePath = path.resolve(`${templatePath}//${file}`);
        const contents = fs.readFileSync(absolutePath, 'utf8');

        const template = generateScaffoldTemplate(fileName, contents);

        templates += template;
      }

      const templateWrapper = generateTemplatesWrapper(templates);

      const absoluteOutputPath = path.resolve(outputPath);
      fs.writeFile(absoluteOutputPath, templateWrapper, (err) => {
        if (err) {
          console.error('Error writing Generated templates to file', err);
          return;
        }

        console.log('Templates successfully generated!');
      });
    });
  };
};
