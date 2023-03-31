import { Sensor } from './sensors';
import { KeyValue } from './general';

export type UnknownAttributes = {
  [key: string]: string | KeyValue[] | undefined;
};
export type CustomAttributesFilter = { customAttributes: KeyValue[] };

export type SensorFilterVariables = Omit<
  Sensor,
  'description' | 'customAttributes'
> &
  CustomAttributesFilter &
  UnknownAttributes;

export type SensorFilterWithCustomAttributes = SensorFilterVariables &
  CustomAttributesFilter;
