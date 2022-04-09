// import path from 'path';
// import { fileURLToPath } from 'url';
// import { loadFilesSync } from '@graphql-tools/load-files';
// import { mergeTypeDefs } from '@graphql-tools/merge';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const typesArray = loadFilesSync(__dirname, { extensions: ['js'], ignoreIndex: true });

// export const typeDefs = mergeTypeDefs(typesArray);


// *********************


import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export const typeDefs = (async () => {
// 	try {
// 		const resolversArray = await loadFiles(__dirname, {
// 			extensions: ['js'],
// 			ignoreIndex: true,
// 			requireMethod: (path) => {
// 				//console.log('path', path);
// 				return import(pathToFileURL(path));
// 			},
// 		});
	
// 		//console.log(resolversArray[0])
// 		//console.log(resolversArray[0].auth.definitions)
// 		const resolvers = mergeTypeDefs(resolversArray);
// 		console.log('ÑÑÑÑÑÑÑÑÑÑÑÑ')
// 		console.log(resolvers)
// 		console.log(typeof resolvers)
// 		return resolvers;
// 		//console.log(util.inspect(resolvers, { depth: null, showHidden: false }));
		
// 	} catch (error) {
// 		console.log('******')
// 		console.log(error)
// 		console.log('---')
// 	}
// })();

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
