import {
  BaseTaskTypes,
  CreateDataFetchTaskFormDataRuntype,
  CreateObjectSyncTaskFormDataRuntype,
  DataFetchTaskCreateInputRuntype,
  DataFetchTaskCreatePayload,
  DataFetchTaskCreateInput,
  ObjectSyncTaskCreateInputRuntype,
  TaskAPIInput,
  TaskInput,
  TaskPayload,
  TaskTypes,
  TaskTypesArray,
} from '../../../types/task';
import dayjs from 'dayjs';
import { Sensor } from '../../../types/sensors';
import { TaskTypeAndDefaultValues } from './types';
import { notNil } from '../../../utils/validators';
import { CustomError } from '../../../utils/error';

export const getTaskIndex = (taskType: BaseTaskTypes): number => {
  return TaskTypesArray.indexOf(taskType);
};

export const createTaskDefaultValues = (
  index?: number,
): Partial<Pick<TaskPayload, 'firstRunAt' | 'taskType'>> => {
  return {
    firstRunAt: dayjs(),
    taskType: index ?? 0, //Fall back to first task type value if index is not provided
  };
};

export const createDataFetchTaskDefaultValues = (
  sensors: Sensor[],
): Partial<DataFetchTaskCreatePayload> => {
  return {
    ...createTaskDefaultValues(),
    sensors,
    dateFrom: null,
    dateTo: null,
  };
};

export const getTaskType = (value: unknown): TaskTypes => {
  if (DataFetchTaskCreateInputRuntype.guard(value)) {
    return 'DATA_FETCH';
  }
  if (ObjectSyncTaskCreateInputRuntype.guard(value)) {
    return 'OBJECT_SYNC';
  }
  return 'UNKNOWN';
};

export const getTaskTypeAndDefaultValues = (
  value: unknown,
): TaskTypeAndDefaultValues => {
  switch (getTaskType(value)) {
    case 'DATA_FETCH':
      return {
        type: 'DATA_FETCH',
        defaultValues: createDataFetchTaskDefaultValues(
          (value as DataFetchTaskCreateInput).sensors,
        ),
      };
    case 'OBJECT_SYNC':
      return {
        type: 'OBJECT_SYNC',
        defaultValues: createTaskDefaultValues(
          getTaskIndex((value as TaskInput).taskType),
        ),
      };
    default:
      return { type: 'UNKNOWN', defaultValues: { firstRunAt: dayjs() } };
  }
};

export const taskSubmitHandler = (task: TaskPayload): TaskAPIInput => {
  if (CreateDataFetchTaskFormDataRuntype.guard(task)) {
    const entities = task.sensors;
    let periodicData;
    if (notNil(task.pattern)) {
      periodicData = {
        pattern: task.pattern,
        fetchDurationSeconds: task.fetchDurationSeconds,
      };
    }
    return {
      name: task.name,
      taskType: TaskTypesArray[task.taskType],
      firstRunAt: task.firstRunAt?.toISOString(),
      periodicData,
      taskPayload: {
        entityType: 'SENSOR',
        entities: entities.map((entity) => ({
          id: entity.id,
          fileName: entity.fileName,
        })),
        dateTo: task.dateTo?.toISOString(),
        dateFrom: task.dateFrom?.toISOString(),
      },
    };
  } else if (CreateObjectSyncTaskFormDataRuntype.guard(task)) {
    let periodicData;
    if (notNil(task.pattern)) {
      periodicData = {
        pattern: task.pattern,
      };
    }
    return {
      name: task.name,
      taskType: TaskTypesArray[task.taskType],
      firstRunAt: task.firstRunAt?.toISOString(),
      periodicData,
      taskPayload: {
        groupTypeIdentifier: task.groupTypeIdentifier,
      },
    };
  }

  throw new CustomError('Unknown payload submitted to form handler!');
};