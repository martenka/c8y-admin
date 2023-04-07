import {
  createPaginatedResponseRuntype,
  NonEmptyString,
  StringOrNumber,
} from './general';
import { Record, String, Partial, Static, Dictionary } from 'runtypes';

export const SensorRuntype = Record({
  id: NonEmptyString,
  managedObjectId: StringOrNumber,
  managedObjectName: String,
  valueFragmentType: String,
}).And(
  Partial({
    valueFragmentDisplayName: String,
    description: String,
    customAttributes: Dictionary(NonEmptyString, String),
  }),
);

export const PaginatedSensorsResponseRuntype =
  createPaginatedResponseRuntype(SensorRuntype);

export type SensorsResponse = Static<typeof PaginatedSensorsResponseRuntype>;
export type Sensor = Static<typeof SensorRuntype>;
