import { Partial, Record, String, Number, Array, Static } from 'runtypes';
import {
  createPaginatedResponseRuntype,
  CustomAttributesRuntype,
  NonEmptyString,
} from './general';
import { SensorRuntype } from './sensors';

export const GroupRuntype = Record({
  id: NonEmptyString,
  name: String,
}).And(
  Partial({
    description: String,
    sensorAmount: Number,
    sensors: Array(SensorRuntype),
  }).And(CustomAttributesRuntype),
);

export const PaginatedGroupsResponseRuntype =
  createPaginatedResponseRuntype(GroupRuntype);

export type Group = Static<typeof GroupRuntype>;
