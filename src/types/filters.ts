import { Sensor } from './sensors';
import { KeyValue } from './general';
import { Task } from './task';
import { Dayjs } from 'dayjs';
import { File } from './files';

export const TrueFalseArray = ['true', 'false'] as const;
export type TrueFalse = Lowercase<(typeof TrueFalseArray)[number]>;
export const TrueFalseSelectOptions: {
  id: number;
  label: Capitalize<TrueFalse>;
}[] = [
  { id: 0, label: 'True' },
  { id: 1, label: 'False' },
];

export type UnknownAttributes = {
  [key: string | number]:
    | string
    | boolean
    | number
    | KeyValue[]
    | Dayjs
    | undefined
    | null;
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

export type TaskFilterVariables = Omit<
  Task,
  'createdAt' | 'taskType' | 'taskStatus'
> &
  Partial<{
    firstRunAt: Dayjs | null;
    isPeriodic: number;
    taskStatus: number;
    taskType: number;
  }> &
  UnknownAttributes;

export type FileFilterVariables = Partial<
  Pick<File, 'id' | 'createdByTask'> & {
    sensorId: string;
    fileName: string;
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
  } & Omit<Sensor, 'id' | 'customAttributes' | 'description'>
> &
  UnknownAttributes;
