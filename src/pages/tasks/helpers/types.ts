import { TaskPayload, TaskTypes } from '../../../types/task';

export interface TaskTypeAndDefaultValues {
  type: TaskTypes;
  defaultValues: Partial<TaskPayload>;
}
