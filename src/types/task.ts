import {
  Literal,
  Partial,
  Record,
  Union,
  String,
  Number,
  Array,
  Static,
  Unknown,
  Null,
} from 'runtypes';
import { NonEmptyString } from './general';
import { SensorRuntype } from './sensors';
import { isDayjs } from 'dayjs';

export const TaskStepsRuntype = Union(
  Literal('NOT_STARTED'),
  Literal('IN_QUEUE'),
  Literal('PROCESSING'),
  Literal('DONE'),
  Literal('FAILED'),
);

export const TaskTypesRuntype = Union(
  Literal('DATA_FETCH'),
  Literal('OBJECT_SYNC'),
);

export const TaskEntityTypes = Union(Literal('GROUP'), Literal('SENSOR'));

export const TaskTypesArray = TaskTypesRuntype.alternatives.map(
  (item) => item.value,
);

export const TaskRuntype = Record({
  id: NonEmptyString,
  name: NonEmptyString,
  status: TaskStepsRuntype,
  taskType: TaskTypesRuntype,
}).And(
  Partial({
    createdAt: String,
  }),
);
export const DataFetchTaskCreateInputRuntype = Record({
  sensors: Array(SensorRuntype),
});

export const BaseCreateTaskFormData = Record({
  taskType: Number,
}).And(
  Partial({
    firstRunAt: Unknown.withGuard(isDayjs),
    name: String,
    pattern: String,
    fetchDurationSeconds: Number,
  }),
);

export const CreateDataFetchTaskFormDataRuntype = BaseCreateTaskFormData.And(
  Record({
    sensors: Array(
      SensorRuntype.And(
        Partial({
          fileName: String,
        }),
      ),
    ),
  }).And(
    Partial({
      dateFrom: Unknown.withGuard(isDayjs).Or(Null),
      dateTo: Unknown.withGuard(isDayjs).Or(Null),
    }),
  ),
);

export const CreateObjectSyncTaskFormDataRuntype = BaseCreateTaskFormData.And(
  Partial({
    groupTypeIdentifier: String,
  }),
);

export const CreateTaskRuntype = Union(
  CreateDataFetchTaskFormDataRuntype,
  CreateObjectSyncTaskFormDataRuntype,
);

export const TaskAPIInputRuntype = Record({
  taskType: TaskTypesRuntype,
}).And(
  Partial({
    name: String,
    firstRunAt: String,
    periodicData: Record({
      pattern: NonEmptyString,
    }).And(
      Partial({
        fetchDurationSeconds: Number,
      }),
    ),
  }),
);

export const DataFetchEntity = Record({
  id: String,
}).And(
  Partial({
    fileName: String,
  }),
);

export const DataFetchTaskPayloadAPIInputRuntype = Record({
  taskPayload: Record({
    entityType: TaskEntityTypes,
    entities: Array(DataFetchEntity),
  }).And(
    Partial({
      dateFrom: String,
      dateTo: String,
    }),
  ),
});

export const DataFetchTaskAPIInputRuntype = TaskAPIInputRuntype.And(
  DataFetchTaskPayloadAPIInputRuntype,
);

export type Task = Static<typeof TaskRuntype>;
export type TaskSteps = Static<typeof TaskStepsRuntype>;
export type TaskTypes = Static<typeof TaskTypesRuntype> | 'UNKNOWN';
export type TaskPayload = Static<typeof CreateTaskRuntype>;
export type DataFetchTaskCreatePayload = Static<
  typeof CreateDataFetchTaskFormDataRuntype
>;
export type ObjectSynctaskCreatePayload = Static<
  typeof CreateObjectSyncTaskFormDataRuntype
>;

export type DataFetchTaskInput = Static<typeof DataFetchTaskCreateInputRuntype>;
export type DataFetchTaskAPIInput = Static<typeof DataFetchTaskAPIInputRuntype>;
