import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const initTypeDefinition = async () => {
	const resolversArray = await loadFiles(__dirname, {
		extensions: ['js'],
		ignoreIndex: true,
		requireMethod: (path) => {
			return import(pathToFileURL(path));
		},
	});

	return mergeTypeDefs(resolversArray);
};
