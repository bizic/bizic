import babelRegister from '@babel/register';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
babelRegister({
  presets: [
    '@babel/typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14',
        },
      },
    ],
  ],
  extensions,
});

process.env.UNIT_TEST = '1';
