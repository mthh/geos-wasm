import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import pkg from './package.json' assert { type: 'json' }

export default [
  // browser-friendly (minified) UMD build
  {
    input: 'src/index.mjs',
    output: {
      name: 'geos',
      file: pkg.browser,
      globals: {
        'util': 'util',
      },
      format: 'umd'
    },
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      terser()
    ]
  },
  {
    input: 'src/index.mjs',
    output: [
      {
        name: 'geos',
        file: pkg.module,
        globals: {
          'util': 'util',
        },
        format: 'es'
      },
      {
        name: 'geos',
        globals: {
          'util': 'util',
        },
        file: 'docs/assets/geos.esm.js',
        format: 'es'
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      terser()
    ]
  }
]