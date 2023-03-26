import { Partial, Record, String, Array, Static } from 'runtypes';
import { NonEmptyString, StringOrNumber } from './general';

export const FileStorageRuntype = Record({
  bucket: NonEmptyString,
  path: NonEmptyString,
}).And(
  Partial({
    url: String,
  }),
);

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

export const FileRuntype = Record({
  id: NonEmptyString,
  name: NonEmptyString,
}).And(
  Partial({
    createdByTask: String,
    description: String,
    customAttributes: Record({}),
    metadata: FileMetadataRuntype,
    storage: FileStorageRuntype,
  }),
);

export type File = Static<typeof FileRuntype>;
