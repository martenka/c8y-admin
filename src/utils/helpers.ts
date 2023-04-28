import { notNil } from './validators';
import { SearchTypesArray } from '../types/filters';
import { CrudFilters } from '@refinedev/core';

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
