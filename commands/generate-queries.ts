import fs from 'fs';
import path from 'path';

const generateQueryTemplate = (fileName: string, contents: string) => {
    return `export const ${fileName} = \`${contents}\`;  
    `;
};

type GenerateQueriesProps = {
    queryPath: string;
    outputPath: string;
};

export const generateQueries = ({
    queryPath,
    outputPath,
}: GenerateQueriesProps): (() => Promise<void>) => {
    return async () => {
        fs.readdir(queryPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }

            let queries = '';

            for (const file of files) {
                if (!file.indexOf('graphql')) {
                    continue;
                }

                const fileName = file.split('.graphql')[0];
                const absolutePath = path.resolve(`${queryPath}//${file}`);
                const contents = fs.readFileSync(absolutePath, 'utf8');

                const template = generateQueryTemplate(fileName, contents);

                queries += template;
            }

            const absoluteOutputPath = path.resolve(outputPath);
            fs.writeFile(absoluteOutputPath, queries, (err) => {
                if (err) {
                    console.error('Error writing Generated queries to file', err);
                    return;
                }

                console.log('Queries successfully generated!');
            });
        });
    };
};
