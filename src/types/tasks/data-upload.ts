import {
  BaseCreateTaskFormData,
  TaskAPIInputRuntype,
  TaskTypesRuntype,
} from './base';
import { Array, Record, Static, String } from 'runtypes';
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
export type DataUploadTaskCreatePayload = Static<
  typeof CreateDataUploadTaskFormDataRuntype
>;
export type DataUploadTaskCreateInput = Static<
  typeof DataUploadTaskCreateInputRuntype
>;
export type DataUploadTaskAPIInput = Static<
  typeof DataUploadTaskAPIInputRuntype
>;
