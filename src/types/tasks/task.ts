import { Static, Union } from 'runtypes';
import {
  CreateDataFetchTaskFormDataRuntype,
  DataFetchTaskAPIInput,
  DataFetchTaskCreateInputRuntype,
} from './data-fetch';
import {
  CreateObjectSyncTaskFormDataRuntype,
  ObjectSyncTaskAPIInput,
  ObjectSyncTaskCreateInputRuntype,
} from './object-sync';
import {
  CreateDataUploadTaskFormDataRuntype,
  DataUploadTaskAPIInput,
  DataUploadTaskCreateInputRuntype,
} from './data-upload';

export const TaskInputRuntype = Union(
  DataFetchTaskCreateInputRuntype,
  ObjectSyncTaskCreateInputRuntype,
  DataUploadTaskCreateInputRuntype,
);

export const CreateTaskRuntype = Union(
  CreateDataFetchTaskFormDataRuntype,
  CreateObjectSyncTaskFormDataRuntype,
  CreateDataUploadTaskFormDataRuntype,
);

export type TaskPayload = Static<typeof CreateTaskRuntype>;

export type TaskInput = Static<typeof TaskInputRuntype>;

export type TaskAPIInput =
  | DataFetchTaskAPIInput
  | ObjectSyncTaskAPIInput
  | DataUploadTaskAPIInput;
