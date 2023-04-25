import {
  BaseCreateTaskFormData,
  TaskAPIInputRuntype,
  TaskRuntype,
  TaskTypesRuntype,
} from './base';
import { Array, Partial, Record, Static, String } from 'runtypes';
import { FileRuntype } from '../files';

const Files = Record({ files: Array(FileRuntype) });
export const DataUploadTaskCreateInputRuntype = Record({
  taskType: TaskTypesRuntype.alternatives[2],
}).And(Files);
export const CreateDataUploadTaskFormDataRuntype =
  BaseCreateTaskFormData.And(Files);
export const DataUploadTaskAPIInputRuntype = TaskAPIInputRuntype.And(
  Record({
    taskPayload: Record({
      fileIds: Array(String),
    }),
  }),
);

const FileStorageRuntype = Record({
  bucket: String,
  path: String,
});

const FileMetadata = Record({
  dateFrom: String,
  dateTo: String,
  managedObjectId: String,
  valueFragmentType: String,
}).And(
  Partial({
    valueFragmentDescription: String,
    managedObjectName: String,
    description: String,
  }),
);

export const DataUploadFileRuntype = Record({
  fileId: String,
  fileName: String,
  storage: FileStorageRuntype,
  metadata: FileMetadata,
}).And(
  Partial({
    customAttributes: Record({}),
  }),
);

const PlatformRuntype = Record({
  platformIdentifier: String,
});

export const DataUploadTaskPayload = Record({
  files: Array(DataUploadFileRuntype),
  platform: PlatformRuntype,
});

export const DataUploadTaskRuntype = TaskRuntype.And(
  Record({
    payload: DataUploadTaskPayload,
  }),
);

export type DataUploadTaskCreatePayload = Static<
  typeof CreateDataUploadTaskFormDataRuntype
>;
export type DataUploadTaskCreateInput = Static<
  typeof DataUploadTaskCreateInputRuntype
>;
export type DataUploadTaskAPIInput = Static<
  typeof DataUploadTaskAPIInputRuntype
>;

export type DataUploadTask = Static<typeof DataUploadTaskRuntype>;
export type DataUploadTaskPayload = Static<typeof DataUploadTaskPayload>;
export type DataUploadFile = Static<typeof DataUploadFileRuntype>;
