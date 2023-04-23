import { Partial, Record, String, Array, Static, Boolean } from 'runtypes';
import { NonEmptyString, StringOrNumber } from './general';

export const FileStorageRuntype = Record({
  bucket: NonEmptyString,
  path: NonEmptyString,
}).And(
  Partial({
    url: String,
  }),
);

export enum VisibilityStateValues {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export const FileValueFragmentRuntype = Record({
  type: NonEmptyString,
  description: String,
});

export const FileMetadataRuntype = Partial({
  fromDate: String,
  toDate: String,
  managedObjectId: StringOrNumber,
  managedObjectName: String,
  sensors: Array(String),
  valueFragments: Array(FileValueFragmentRuntype),
});

export const FileVisibilityStateRuntype = Record({
  published: Boolean,
  stateChanging: Boolean,
}).And(Partial({ errorMessage: String }));

export const FileRuntype = Record({
  id: NonEmptyString,
  name: NonEmptyString,
  visibilityState: FileVisibilityStateRuntype,
}).And(
  Partial({
    createdByTask: String,
    description: String,
    customAttributes: Record({}),
    metadata: FileMetadataRuntype,
    storage: FileStorageRuntype,
    url: String,
  }),
);

export type File = Static<typeof FileRuntype>;
export type FileVisibilityState = Static<typeof FileVisibilityStateRuntype>;
