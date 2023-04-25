import { Sensor } from './sensors';
import { KeyValue } from './general';
import { Dayjs } from 'dayjs';
import { File } from './files';
import { Group } from './group';
import { Task } from './tasks/base';

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
export type CustomAttributesFilterVariablesType = {
  customAttributes: KeyValue[];
};

export type CustomAndUnknownFilterVariables =
  CustomAttributesFilterVariablesType & UnknownAttributes;

export type SensorFilterVariables = Partial<
  Omit<Sensor, 'description' | 'customAttributes'>
> &
  CustomAndUnknownFilterVariables;

export type TaskFilterVariables = Omit<
  Task,
  'createdAt' | 'taskType' | 'taskStatus' | 'metadata'
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

export type GroupFilterVariables = Partial<
  Pick<Omit<Group, 'customAttributes'>, 'id' | 'name'>
> &
  CustomAndUnknownFilterVariables;
