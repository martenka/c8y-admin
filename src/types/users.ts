import { Partial, Record, String, Array, Static } from 'runtypes';
import { NonEmptyString } from './general';

export const UserRuntype = Record({
  id: NonEmptyString,
  roles: Array(String),
}).And(
  Partial({
    username: String,
  }),
);

export type User = Static<typeof UserRuntype>;
