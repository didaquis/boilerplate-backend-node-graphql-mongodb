import jsonfile from 'jsonfile';

let packageJSONData; 

describe('package.json file', () => {

	beforeAll(() => {
		const file = './package.json';
		packageJSONData = jsonfile.readFileSync(file);
	});

	test('Should have all dependencies with semver version fixed', () => {
		if (packageJSONData.dependencies) {
			const validPattern = /^(\d+\.)(\d+\.)(\d+)$/;
			const regex = RegExp(validPattern);
	
			let allDependenciesAreFixed = true;
			for (let key in packageJSONData.dependencies){
				if (Object.prototype.hasOwnProperty.call(packageJSONData.dependencies, key)) {
					if (!regex.test(packageJSONData.dependencies[key])) {
						allDependenciesAreFixed = false;
					}
				}
			}
	
			expect(allDependenciesAreFixed).toBe(true);
		}
	});

	test('Should have all devDependencies with semver version fixed', () => {
		if (packageJSONData.devDependencies) {
			const validPattern = /^(\d+\.)(\d+\.)(\d+)/;
			const regex = RegExp(validPattern);

			let allDevDependenciesAreFixed = true;

			for (let key in packageJSONData.devDependencies){
				if (Object.prototype.hasOwnProperty.call(packageJSONData.devDependencies, key)) {
					if (!regex.test(packageJSONData.devDependencies[key])) {
						allDevDependenciesAreFixed = false;
					}
				}
			}

			expect(allDevDependenciesAreFixed).toBe(true);
		}
	});
});