import {
  Array,
  Null,
  Number,
  Partial,
  Record,
  Static,
  String,
  Unknown,
} from 'runtypes';
import {
  BaseCreateTaskFormData,
  TaskAPIInputRuntype,
  TaskEntityTypes,
  TaskRuntype,
  TaskTypesRuntype,
} from './base';
import { SensorRuntype } from '../sensors';
import { isDayjs } from 'dayjs';

export const DataFetchTaskCreateInputRuntype = Record({
  taskType: TaskTypesRuntype.alternatives[0],
  sensors: Array(SensorRuntype),
});
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

const SensorData = Record({
  sensor: SensorRuntype.Or(String),
}).And(
  Partial({
    fileId: String,
    fileName: String,
    bucket: String,
    filePath: String,
    fileURL: String,
  }),
);
export const DataFetchTaskPayloadRuntype = Record({
  data: Array(SensorData),
}).And(
  Partial({
    dateFrom: String,
    dateTo: String,
    group: String,
  }),
);

export const DataFetchTaskRuntype = TaskRuntype.And(
  Record({
    payload: DataFetchTaskPayloadRuntype,
  }),
);

export type DataFetchTaskCreatePayload = Static<
  typeof CreateDataFetchTaskFormDataRuntype
>;
export type DataFetchTaskCreateInput = Static<
  typeof DataFetchTaskCreateInputRuntype
>;
export type DataFetchTaskAPIInput = Static<typeof DataFetchTaskAPIInputRuntype>;
export type DataFetchTask = Static<typeof DataFetchTaskRuntype>;
export type DataFetchTaskPayload = Static<typeof DataFetchTaskPayloadRuntype>;
