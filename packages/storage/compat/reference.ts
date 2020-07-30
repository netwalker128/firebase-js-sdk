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

import {
  Reference,
  getChild,
  getParent,
  uploadBytes,
  uploadString,
  list,
  listAll,
  getDownloadURL,
  getMetadata,
  updateMetadata,
  deleteObject
} from '../src/reference';
import {
  validate,
  stringSpec,
  listOptionSpec,
  metadataSpec,
  uploadDataSpec
} from '../src/implementation/args';
import { Metadata } from '../src/metadata';
import { UploadTask } from '../src/task';
import { StringFormat, formatValidator } from '../src/implementation/string';
import { ListResult, ListOptions } from '../src/list';

export class ReferenceCompat extends Reference {
  static fromReference(ref: Reference): ReferenceCompat {
    return new ReferenceCompat(ref.service, ref.location);
  }
  toString(): string {
    validate('toString', [], arguments);
    return super.toString();
  }
  /**
   * @return A reference to the object obtained by
   *     appending childPath, removing any duplicate, beginning, or trailing
   *     slashes.
   */
  child(childPath: string): ReferenceCompat {
    validate('child', [stringSpec()], arguments);
    const reference = getChild(this, childPath);
    return ReferenceCompat.fromReference(reference);
  }

  /**
   * @return A reference to the parent of the
   *     current object, or null if the current object is the root.
   */
  get parent(): ReferenceCompat | null {
    validate('parent', [], arguments);
    const reference = getParent(this);
    if (reference == null) {
      return null;
    }
    return ReferenceCompat.fromReference(reference);
  }

  /**
   * Uploads a blob to this object's location.
   * @param data The blob to upload.
   * @return An UploadTask that lets you control and
   *     observe the upload.
   */
  put(
    data: Blob | Uint8Array | ArrayBuffer,
    metadata: Metadata | null = null
  ): UploadTask {
    validate('put', [uploadDataSpec(), metadataSpec(true)], arguments);
    this.throwIfRoot_('put');
    return uploadBytes(this, data, metadata);
  }
  /**
   * Uploads a string to this object's location.
   * @param value The string to upload.
   * @param format The format of the string to upload.
   * @return An UploadTask that lets you control and
   *     observe the upload.
   */
  putString(
    value: string,
    format: StringFormat = StringFormat.RAW,
    metadata?: Metadata
  ): UploadTask {
    validate(
      'putString',
      [stringSpec(), stringSpec(formatValidator, true), metadataSpec(true)],
      arguments
    );
    this.throwIfRoot_('putString');
    return uploadString(this, value, format, metadata);
  }
  /**
   * List all items (files) and prefixes (folders) under this storage reference.
   *
   * This is a helper method for calling list() repeatedly until there are
   * no more results. The default pagination size is 1000.
   *
   * Note: The results may not be consistent if objects are changed while this
   * operation is running.
   *
   * Warning: listAll may potentially consume too many resources if there are
   * too many results.
   *
   * @return A Promise that resolves with all the items and prefixes under
   *      the current storage reference. `prefixes` contains references to
   *      sub-directories and `items` contains references to objects in this
   *      folder. `nextPageToken` is never returned.
   */
  listAll(): Promise<ListResult> {
    validate('listAll', [], arguments);
    return listAll(this);
  }
  /**
   * List items (files) and prefixes (folders) under this storage reference.
   *
   * List API is only available for Firebase Rules Version 2.
   *
   * GCS is a key-blob store. Firebase Storage imposes the semantic of '/'
   * delimited folder structure.
   * Refer to GCS's List API if you want to learn more.
   *
   * To adhere to Firebase Rules's Semantics, Firebase Storage does not
   * support objects whose paths end with "/" or contain two consecutive
   * "/"s. Firebase Storage List API will filter these unsupported objects.
   * list() may fail if there are too many unsupported objects in the bucket.
   *
   * @param options See ListOptions for details.
   * @return A Promise that resolves with the items and prefixes.
   *      `prefixes` contains references to sub-folders and `items`
   *      contains references to objects in this folder. `nextPageToken`
   *      can be used to get the rest of the results.
   */
  list(options?: ListOptions | null): Promise<ListResult> {
    validate('list', [listOptionSpec(true)], arguments);
    return list(this, options);
  }

  /**
   *     A promise that resolves with the metadata for this object. If this
   *     object doesn't exist or metadata cannot be retreived, the promise is
   *     rejected.
   */
  getMetadata(): Promise<Metadata> {
    validate('getMetadata', [], arguments);
    return getMetadata(this);
  }

  /**
   * Updates the metadata for this object.
   * @param metadata The new metadata for the object.
   *     Only values that have been explicitly set will be changed. Explicitly
   *     setting a value to null will remove the metadata.
   * @return A promise that resolves
   *     with the new metadata for this object.
   *     @see firebaseStorage.Reference.prototype.getMetadata
   */
  updateMetadata(metadata: Metadata): Promise<Metadata> {
    validate('updateMetadata', [metadataSpec()], arguments);
    return updateMetadata(this, metadata);
  }

  /**
   * @return A promise that resolves with the download
   *     URL for this object.
   */
  getDownloadURL(): Promise<string> {
    validate('getDownloadURL', [], arguments);
    return getDownloadURL(this);
  }

  /**
   * Deletes the object at this location.
   * @return A promise that resolves if the deletion succeeds.
   */
  delete(): Promise<void> {
    validate('delete', [], arguments);
    this.throwIfRoot_('delete');
    return deleteObject(this);
  }
}
