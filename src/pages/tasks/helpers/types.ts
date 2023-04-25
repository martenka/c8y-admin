import { TaskPayload } from '../../../types/tasks/task';
import {TaskTypes} from "../../../types/tasks/base";

export interface TaskTypeAndDefaultValues {
  type: TaskTypes;
  defaultValues: Partial<TaskPayload>;
}
