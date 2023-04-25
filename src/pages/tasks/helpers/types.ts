import { TaskPayload } from '../../../types/tasks/task';
import { BaseTask, TaskTypes } from '../../../types/tasks/base';

export interface TaskTypeAndDefaultValues {
  type: TaskTypes;
  defaultValues: Partial<TaskPayload>;
}

export interface TaskProps<T extends BaseTask = BaseTask> {
  token?: string;
  task: T;
}
