import {
  BaseCreateTaskFormData,
  TaskAPIInputRuntype,
  TaskTypesRuntype,
} from './base';
import { Partial, Record, Static, String } from 'runtypes';

export const ObjectSyncTaskCreateInputRuntype = Record({
  taskType: TaskTypesRuntype.alternatives[1],
});
export const CreateObjectSyncTaskFormDataRuntype = BaseCreateTaskFormData.And(
  Partial({
    groupTypeIdentifier: String,
  }),
);
export const ObjectSyncTaskAPIInputRuntype = TaskAPIInputRuntype.And(
  Record({
    taskPayload: Partial({
      groupTypeIdentifier: String,
    }),
  }),
);
export type ObjectSyncTaskCreatePayload = Static<
  typeof CreateObjectSyncTaskFormDataRuntype
>;
export type ObjectSyncTaskAPIInput = Static<
  typeof ObjectSyncTaskAPIInputRuntype
>;
