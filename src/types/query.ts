import { Number, Partial, Record, Static } from 'runtypes';

export interface PagingQueryOptions {
  pageSize?: number;
  currentPage?: number;
  withTotalElements?: boolean;
  withTotalPages?: boolean;
}

export const PageInfoRuntype = Record({
  pageSize: Number,
}).And(
  Partial({
    currentPage: Number,
    totalElements: Number,
    totalPages: Number,
  }),
);

export type PageInfo = Static<typeof PageInfoRuntype>;
