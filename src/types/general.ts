import {
  Partial,
  Record,
  String,
  Number,
  Array,
  Runtype,
  Unknown,
  Static,
} from 'runtypes';
import { PageInfoRuntype } from './query';

export const NonEmptyString = String.withConstraint(
  (value) => value.length !== 0,
);
export const StringOrNumber = String.Or(Number);

export const GeneralApiResponseRuntype = Record({
  pageInfo: PageInfoRuntype,
  data: Array(Unknown),
});

export function createPaginatedResponseRuntype<T>(dataType: Runtype<T>) {
  return Record({
    pageInfo: Record({
      pageSize: Number,
    }).And(
      Partial({
        currentPage: Number,
        totalElements: Number,
        totalPages: Number,
      }),
    ),
    data: Array(dataType),
  });
}

export type GeneralApiResponse = Static<typeof GeneralApiResponseRuntype>;

export type KeyValue = { key: string; value: string };
export type ManyKeyValues = { [key: string]: KeyValue };
