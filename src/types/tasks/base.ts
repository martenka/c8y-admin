import {
  Literal,
  Number,
  Partial,
  Record,
  Static,
  String,
  Union,
  Unknown,
} from 'runtypes';
import { NonEmptyString } from '../general';
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

const TaskPeriodicDataRuntype = Partial({
  pattern: String,
  fetchDurationSeconds: String,
});

export const TaskMetadataRuntype = Partial({
  lastRanAt: String,
  lastCompletedAt: String,
  lastFailedAt: String,
  lastFailReason: String,
  firstRunAt: String,
  periodicData: TaskPeriodicDataRuntype,
});

export const TaskRuntype = Record({
  id: NonEmptyString,
  name: NonEmptyString,
  status: TaskStepsRuntype,
  taskType: TaskTypesRuntype,
}).And(
  Partial({
    createdAt: String,
    metadata: TaskMetadataRuntype,
  }),
);
export type Task = Static<typeof TaskRuntype>;
export const TaskTypesSelectOptions = TaskTypesArray.map((item, index) => ({
  id: index,
  label: item,
}));
export const TaskStatusSelectOptions = TaskStatusArray.map((item, index) => ({
  id: index,
  label: item,
}));
export const BaseCreateTaskFormData = Record({
  taskType: Number,
}).And(
  Partial({
    firstRunAt: Unknown.withGuard(isDayjs),
    name: String,
    pattern: String,
  }),
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
export type TaskStatus = Static<typeof TaskStepsRuntype>;
export type BaseTaskTypes = Static<typeof TaskTypesRuntype>;
export type TaskTypes = BaseTaskTypes | 'UNKNOWN';
