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
import { FileRuntype } from './files';

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
  Literal('DATA_UPLOAD'),
);

export const TaskEntityTypes = Union(Literal('GROUP'), Literal('SENSOR'));

export const TaskTypesArray = TaskTypesRuntype.alternatives.map(
  (item) => item.value,
);

export const TaskTypesMap = TaskTypesArray.reduce(
  (memo, currentValue, currentIndex) => ({
    ...memo,
    [currentValue]: currentIndex,
  }),
  {},
) as {
  [K in (typeof TaskTypesArray)[number]]: number;
};

export const TaskStatusArray = TaskStepsRuntype.alternatives.map(
  (item) => item.value,
);

export const TaskTypesSelectOptions = TaskTypesArray.map((item, index) => ({
  id: index,
  label: item,
}));

export const TaskStatusSelectOptions = TaskStatusArray.map((item, index) => ({
  id: index,
  label: item,
}));

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

export const Files = Record({ files: Array(FileRuntype) });

export const DataFetchTaskCreateInputRuntype = Record({
  taskType: TaskTypesRuntype.alternatives[0],
  sensors: Array(SensorRuntype),
});

export const ObjectSyncTaskCreateInputRuntype = Record({
  taskType: TaskTypesRuntype.alternatives[1],
});

export const DataUploadTaskCreateInputRuntype = Record({
  taskType: TaskTypesRuntype.alternatives[2],
}).And(Files);

export const TaskInputRuntype = Union(
  DataFetchTaskCreateInputRuntype,
  ObjectSyncTaskCreateInputRuntype,
  DataUploadTaskCreateInputRuntype,
);

export const BaseCreateTaskFormData = Record({
  taskType: Number,
}).And(
  Partial({
    firstRunAt: Unknown.withGuard(isDayjs),
    name: String,
    pattern: String,
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
      fetchDurationSeconds: Number,
    }),
  ),
);

export const CreateObjectSyncTaskFormDataRuntype = BaseCreateTaskFormData.And(
  Partial({
    groupTypeIdentifier: String,
  }),
);

export const CreateDataUploadTaskFormDataRuntype =
  BaseCreateTaskFormData.And(Files);

export const CreateTaskRuntype = Union(
  CreateDataFetchTaskFormDataRuntype,
  CreateObjectSyncTaskFormDataRuntype,
  CreateDataUploadTaskFormDataRuntype,
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

export const ObjectSyncTaskAPIInputRuntype = TaskAPIInputRuntype.And(
  Record({
    taskPayload: Partial({
      groupTypeIdentifier: String,
    }),
  }),
);

export const DataUploadTaskAPIInputRuntype = TaskAPIInputRuntype.And(
  Record({
    taskPayload: Record({
      fileIds: Array(String),
    }),
  }),
);

export type Task = Static<typeof TaskRuntype>;
export type TaskStatus = Static<typeof TaskStepsRuntype>;
export type BaseTaskTypes = Static<typeof TaskTypesRuntype>;
export type TaskTypes = BaseTaskTypes | 'UNKNOWN';

export type TaskPayload = Static<typeof CreateTaskRuntype>;
export type DataFetchTaskCreatePayload = Static<
  typeof CreateDataFetchTaskFormDataRuntype
>;
export type ObjectSyncTaskCreatePayload = Static<
  typeof CreateObjectSyncTaskFormDataRuntype
>;
export type DataUploadTaskCreatePayload = Static<
  typeof CreateDataUploadTaskFormDataRuntype
>;

export type TaskInput = Static<typeof TaskInputRuntype>;
export type DataFetchTaskCreateInput = Static<
  typeof DataFetchTaskCreateInputRuntype
>;
export type DataUploadTaskCreateInput = Static<
  typeof DataUploadTaskCreateInputRuntype
>;

export type DataFetchTaskAPIInput = Static<typeof DataFetchTaskAPIInputRuntype>;
export type ObjectSyncTaskAPIInput = Static<
  typeof ObjectSyncTaskAPIInputRuntype
>;
export type DataUploadTaskAPIInput = Static<
  typeof DataUploadTaskAPIInputRuntype
>;
export type TaskAPIInput =
  | DataFetchTaskAPIInput
  | ObjectSyncTaskAPIInput
  | DataUploadTaskAPIInput;
