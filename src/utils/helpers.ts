import { notNil } from './validators';
import { SearchTypesArray } from '../types/filters';
import { CrudFilters } from '@refinedev/core';
import { TaskTypes } from '../types/tasks/base';
import { ValueObject } from '../types/general';

/**
 * First search type is the default setting, this does not need to be sent to backend
 */
export function addSearchTypeIfNotFirstOption(
  filters: CrudFilters,
  searchType?: number,
) {
  if (notNil(searchType) && searchType > 0) {
    const searchTypeValue = SearchTypesArray[searchType];
    if (notNil(searchTypeValue)) {
      filters.push({
        field: 'searchType',
        operator: 'eq',
        value: searchTypeValue,
      });
    }
  }
}

export function getDefaultTaskName(taskType: TaskTypes): string {
  let taskNamePrefix = `UnknownTask-`;

  switch (taskType) {
    case 'DATA_UPLOAD':
      taskNamePrefix = `DataUpload-`;
      break;
    case 'OBJECT_SYNC':
      taskNamePrefix = 'ObjectSync-';
      break;
    case 'DATA_FETCH':
      taskNamePrefix = 'DataFetch-';
      break;
  }

  return `${taskNamePrefix}${new Date().valueOf()}`;
}

export function valueObjectArrayToBasicArray<T>(input: ValueObject<T>[]): T[] {
  return input.map((value) => value.value);
}

export function pickBy<T extends object>(
  pickFrom: T,
  keyfn: <K extends keyof T>(value: T[K], key: K) => boolean,
): Partial<T> {
  const obj: Partial<T> = {};

  for (const key in pickFrom) {
    if (keyfn(pickFrom[key], key)) {
      obj[key] = pickFrom[key];
    }
  }

  return obj;
}

export function removeNilProperties<T extends object>(value: T): Partial<T> {
  return pickBy(value, (element) => notNil(element));
}

/**
 * Removes undefined, null values and empty string keys and values
 */
export function removeNilAndEmptyProperties<T extends object>(
  value: T,
): Partial<T> {
  return pickBy(
    value,
    (element, key) => notNil(element) && element !== '' && key !== '',
  );
}
