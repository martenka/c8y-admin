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
  Literal('WAITING_NEXT_CYCLE'),
  Literal('DONE'),
  Literal('FAILED'),
  Literal('DISABLED'),
);

export const TaskModesRuntype = Union(Literal('ENABLED'), Literal('DISABLED'));

export const TaskTypesRuntype = Union(
  Literal('DATA_FETCH'),
  Literal('OBJECT_SYNC'),
  Literal('DATA_UPLOAD'),
);
export const TaskEntityTypes = Union(Literal('GROUP'), Literal('SENSOR'));
export const TaskTypesArray = TaskTypesRuntype.alternatives.map(
  (item) => item.value,
);
export const TaskStatusArray = TaskStepsRuntype.alternatives.map(
  (item) => item.value,
);
export const TaskModesArray = TaskModesRuntype.alternatives.map(
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

export const TaskStepsMap = TaskStatusArray.reduce(
  (memo, currentValue, currentIndex) => ({
    ...memo,
    [currentValue]: currentIndex,
  }),
  {},
) as {
  [K in (typeof TaskStatusArray)[number]]: number;
};

export const TaskModesMap = TaskModesArray.reduce(
  (memo, currentValue, currentIndex) => ({
    ...memo,
    [currentValue]: currentIndex,
  }),
  {},
) as {
  [K in (typeof TaskModesArray)[number]]: number;
};

const TaskPeriodicDataRuntype = Partial({
  pattern: String,
  windowDurationSeconds: Number.Or(String),
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
  taskType: TaskTypesRuntype.Or(String),
}).And(
  Partial({
    createdAt: String,
    metadata: TaskMetadataRuntype,
    mode: TaskModesRuntype,
  }),
);
export type BaseTask = Static<typeof TaskRuntype>;
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
        windowDurationSeconds: Number,
      }),
    ),
  }),
);
export type TaskStatus = Static<typeof TaskStepsRuntype>;
export type BaseTaskTypes = Static<typeof TaskTypesRuntype>;
export type TaskTypes = BaseTaskTypes | 'UNKNOWN';
