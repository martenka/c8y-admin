import { Literal, Partial, Record, Union, String, Static } from 'runtypes';
import { NonEmptyString } from './general';

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

export type Task = Static<typeof TaskRuntype>;
export type TaskSteps = Static<typeof TaskStepsRuntype>;
export type TaskTypes = Static<typeof TaskTypesRuntype>;
