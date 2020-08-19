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

import { runTests, getTestTasks, createTestTask } from './run_changed';

/**
 * Always run tests in these paths.
 */
const alwaysRunTestPackages = [
  // These tests are very fast.
  'firebase-namespace-integration-test'
];

const ignoredPackages = [
  '@firebase/firestore',
  'firebase-firestore-integration-test'
];

async function run() {
  let testTasks = await getTestTasks();

  // add alwaysRunTestPackages to tests if they don't already have a task
  for (const packageToTest of alwaysRunTestPackages) {
    if (!testTasks.find(t => t.pkgName === packageToTest)) {
      testTasks.push(createTestTask(packageToTest));
    }
  }

  // remove the ignored packages from the tasks
  testTasks = testTasks.filter(t => !ignoredPackages.includes(t.pkgName));

  runTests(testTasks);
}

run();
