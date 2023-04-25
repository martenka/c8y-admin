import {
  TaskInput,
  TaskPayload,
  TaskAPIInput,
} from '../../../types/tasks/task';
import { File } from '../../../types/files';
import dayjs from 'dayjs';
import { Sensor } from '../../../types/sensors';
import { TaskTypeAndDefaultValues } from './types';
import { notNil } from '../../../utils/validators';
import { CustomError } from '../../../utils/error';
import {
  BaseTaskTypes,
  TaskTypes,
  TaskTypesArray,
  TaskTypesMap,
} from '../../../types/tasks/base';
import {
  CreateDataFetchTaskFormDataRuntype,
  DataFetchTaskCreateInput,
  DataFetchTaskCreateInputRuntype,
  DataFetchTaskCreatePayload,
} from '../../../types/tasks/data-fetch';
import {
  CreateObjectSyncTaskFormDataRuntype,
  ObjectSyncTaskCreateInputRuntype,
} from '../../../types/tasks/object-sync';
import {
  CreateDataUploadTaskFormDataRuntype,
  DataUploadTaskCreateInput,
  DataUploadTaskCreateInputRuntype,
  DataUploadTaskCreatePayload,
} from '../../../types/tasks/data-upload';

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

export const createDataUploadTaskDefaultValues = (
  files: File[],
): Partial<DataUploadTaskCreatePayload> => {
  return {
    ...createTaskDefaultValues(TaskTypesMap['DATA_UPLOAD']),
    files,
  };
};

export const getTaskType = (value: unknown): TaskTypes => {
  if (DataFetchTaskCreateInputRuntype.guard(value)) {
    return 'DATA_FETCH';
  }
  if (ObjectSyncTaskCreateInputRuntype.guard(value)) {
    return 'OBJECT_SYNC';
  }
  if (DataUploadTaskCreateInputRuntype.guard(value)) {
    return 'DATA_UPLOAD';
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
    case 'DATA_UPLOAD':
      return {
        type: 'DATA_UPLOAD',
        defaultValues: createDataUploadTaskDefaultValues(
          (value as DataUploadTaskCreateInput).files,
        ),
      };
    default:
      return { type: 'UNKNOWN', defaultValues: { firstRunAt: dayjs() } };
  }
};

export const taskSubmitHandler = (task: TaskPayload): TaskAPIInput => {
  if (
    task.taskType === TaskTypesMap['DATA_FETCH'] &&
    CreateDataFetchTaskFormDataRuntype.guard(task)
  ) {
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
  } else if (
    task.taskType === TaskTypesMap['OBJECT_SYNC'] &&
    CreateObjectSyncTaskFormDataRuntype.guard(task)
  ) {
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
  } else if (
    task.taskType === TaskTypesMap['DATA_UPLOAD'] &&
    CreateDataUploadTaskFormDataRuntype.guard(task)
  ) {
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
        fileIds: task.files.map((file) => file.id),
      },
    };
  }

  throw new CustomError('Unknown payload submitted to form handler!');
};
