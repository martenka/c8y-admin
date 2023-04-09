import { isNil } from './validators';
import { KeyValue, ManyKeyValues } from '../types/general';
import { CrudFilters } from '@refinedev/core';
import { TrueFalse, UnknownAttributes } from '../types/filters';

export const getKeyValuePair = (
  key?: string,
  value?: string,
): ManyKeyValues => {
  return {
    [crypto.getRandomValues(new Uint32Array(1))[0].toString()]: {
      key: key ?? '',
      value: value ?? '',
    },
  };
};

export const objectToKeyValues: (
  object: Record<string | number, string | number>,
) => ManyKeyValues = (object) => {
  const keyValues: { [key: string]: KeyValue } = {};
  Object.keys(object).forEach((key) => {
    if (isNil(object[key])) {
      return;
    }

    const keyValuePair = getKeyValuePair(
      key.toString(),
      object[key].toString(),
    );

    Object.keys(keyValuePair).forEach(
      (key) => (keyValues[key] = keyValuePair[key]),
    );
  });
  return keyValues;
};

export function ensureArray<T>(value: T | T[]): Array<T> {
  if (isNil(value)) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

export function paramsToSimpleCrudFilters(
  params: UnknownAttributes,
  filters: CrudFilters,
) {
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (isNil(value) || (Array.isArray(value) && value.length === 0)) {
      return;
    }
    filters.push({
      field: key,
      operator: 'eq',
      value: value !== '' ? value : undefined,
    });
  });
}

export function getBooleanValue(
  value: TrueFalse | undefined,
): boolean | undefined {
  if (isNil(value)) {
    return undefined;
  }
  return value.toLowerCase() === 'true';
}
