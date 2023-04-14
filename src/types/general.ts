import {
  Partial,
  Record as RRecord,
  String,
  Number,
  Array,
  Runtype,
  Unknown,
  Static,
  Dictionary,
} from 'runtypes';
import { PageInfoRuntype } from './query';

export const NonEmptyString = String.withConstraint(
  (value) => value.length !== 0,
);
export const StringOrNumber = String.Or(Number);

export const GeneralApiResponseRuntype = RRecord({
  pageInfo: PageInfoRuntype,
  data: Array(Unknown),
});

export function createPaginatedResponseRuntype<T>(dataType: Runtype<T>) {
  return RRecord({
    pageInfo: RRecord({
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

export const KeyValueRuntype = RRecord({
  key: String,
  value: String,
});

export const KeyValuesRuntype = Array(KeyValueRuntype);
export const CustomAttributesRuntype = Partial({
  customAttributes: Dictionary(NonEmptyString, String),
});

export type GeneralApiResponse = Static<typeof GeneralApiResponseRuntype>;

export type KeyValue = Static<typeof KeyValueRuntype>;
export type ManyKeyValues = { [key: string]: KeyValue };
export type CustomAttributes = Static<typeof CustomAttributesRuntype>;
