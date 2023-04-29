import { notNil } from './validators';
import { SearchTypesArray } from '../types/filters';
import { CrudFilters } from '@refinedev/core';
import { TaskTypes } from '../types/tasks/base';

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
