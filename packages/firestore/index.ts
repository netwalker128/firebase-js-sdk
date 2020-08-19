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

import firebase from 'firebase/app';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: '***',
  authDomain: '***.firebaseapp.com',
  databaseURL: 'https://***.firebaseio.com',
  projectId: '***',
  storageBucket: '***.appspot.com',
  messagingSenderId: '***',
  appId: '***'
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function main() {
  const doc = db.doc('coll/doc');
  await doc.set({ foo: 'bar' });
  const snap = await doc.get();
  console.log(snap.data());
}

main();
