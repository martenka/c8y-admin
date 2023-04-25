import { Static, Union } from 'runtypes';
import {
  CreateDataFetchTaskFormDataRuntype,
  DataFetchTask,
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
  DataUploadTask,
  DataUploadTaskAPIInput,
  DataUploadTaskCreateInputRuntype,
} from './data-upload';
import { BaseTask } from './base';

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

export type Task = DataFetchTask | DataUploadTask | BaseTask;
