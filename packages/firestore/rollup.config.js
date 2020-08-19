/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescriptPlugin from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export default {
  input: 'index.ts',
  output: {
    file: 'bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve(),
    json(),
    typescriptPlugin(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            'targets': {
              'ie': '11'
            }
          }
        ]
      ]
    })
  ]
};
