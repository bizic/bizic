/* eslint-disable import/no-extraneous-dependencies */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  plugins: [
    resolve({ extensions }),
    commonjs({
      include: '**/node_modules/**',
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/typescript'],
      extensions,
      include: ['packages/**/src/**/*', 'node_modules/**'],
    }),
  ],
  external: [],
};
