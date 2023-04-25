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
export type DataFetchTaskCreatePayload = Static<
  typeof CreateDataFetchTaskFormDataRuntype
>;
export type DataFetchTaskCreateInput = Static<
  typeof DataFetchTaskCreateInputRuntype
>;
export type DataFetchTaskAPIInput = Static<typeof DataFetchTaskAPIInputRuntype>;
