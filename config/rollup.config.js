import path from 'path';

import makePlugins from './plugins/index';
import makeDevServerPlugins from './plugins/server';

const pkgInfo = require('../package.json');

const isProduction = process.env.NODE_ENV === 'production';

// default config that is used across all builds
const config = {
  input: pkgInfo.source || './index.js',
  treeshake: {
    // We assume reading a property of an object never has side-effects so we
    // disable this option as it can significantly reduce bundle size but
    // can potentially break functionality if you rely on getters or errors
    // from illegal property access.
    propertyReadSideEffects: false
  }
};

export default function makeConfig(commandOptions) {
  const builds = [];

  // dev-server example deck build 
  const example = {
    ...config,
    // dev-server uses index.js as an alternative entry point as we are building
    // an example application, rather than just building the library code.
    input: 'index.js',
    plugins: [
      ...makePlugins(isProduction),
      // if rollup has been ran with `--open`, include the dev server plugins
      ...(commandOptions.open ? makeDevServerPlugins(commandOptions) : [])
    ],
    output: {
      format: 'iife',
      name: 'Spectacle',
      file: path.join('dist', 'example.js')
    }
  };

  // UMD build
  const umd = {
    ...config,
    external: ['react', 'react-is', 'react-dom', 'prop-types'],
    plugins: [...makePlugins(isProduction)],
    output: [
      {
        name: 'Spectacle',
        sourcemap: false,
        file: `./dist/umd/spectacle.js`,
        format: 'umd',
        // specify variable names for external imports
        globals: {
          react: 'React',
          'react-is': 'ReactIs',
          'react-dom': 'ReactDOM',
          'prop-types': 'PropTypes'
        }
      }
    ]
  };

  // if rollup has been ran via `--open` then only
  // include the dev-server IIFE build.
  if (commandOptions.open) {
    builds.push(...[example]);
  }

  // if we are not running the dev-server, include all
  // bundle builds that we publish to npm.
  if (!commandOptions.open) {
    builds.push(...[umd]);
  }

  return builds;
}
