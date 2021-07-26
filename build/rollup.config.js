import fs from 'fs';
import defaultConfig from './common.config';

export default getConfigs();
function getPackageConfig(packageName, externals = []) {
  return {
    input: `./packages/${packageName}/src/index.ts`,
    output: [
      {
        file: `./packages/${packageName}/dist/index.js`,
        format: 'cjs',
        exports: 'named',
      },
      { file: `./packages/${packageName}/dist/index.esm.js`, format: 'es' },
    ],
    ...defaultConfig,
    external: ['vue', '@vue/reactivity', 'bizic', ...externals],
  };
}

function getConfigs() {
  const packages = fs.readdirSync('./packages').filter((name) => name !== '.DS_Store');
  return packages.map((name) => getPackageConfig(name));
}
