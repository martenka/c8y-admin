import {
  CreateDataFetchTaskFormDataRuntype,
  DataFetchTaskAPIInput,
  DataFetchTaskCreateInputRuntype,
  DataFetchTaskCreatePayload,
  DataFetchTaskInput,
  TaskPayload,
  TaskTypes,
  TaskTypesArray,
} from '../../../types/task';
import dayjs from 'dayjs';
import { Sensor } from '../../../types/sensors';
import { TaskTypeAndDefaultValues } from './types';
import { notNil } from '../../../utils/validators';
import { CustomError } from '../../../utils/error';

export const isDataFetchTaskInput = (
  value: unknown,
): value is DataFetchTaskInput => {
  return DataFetchTaskCreateInputRuntype.guard(value);
};

export const createTaskDefaultValues = (): Partial<
  Pick<TaskPayload, 'firstRunAt' | 'taskType'>
> => {
  return {
    firstRunAt: dayjs(),
    taskType: 0, //Take first task type from the array
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
          (value as DataFetchTaskInput).sensors,
        ),
      };
  }

  return { type: 'UNKNOWN', defaultValues: { firstRunAt: dayjs() } };
};

export const taskSubmitHandler = (task: TaskPayload): DataFetchTaskAPIInput => {
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
  }

  throw new CustomError('Unknown payload submitted to form handler!');
};
