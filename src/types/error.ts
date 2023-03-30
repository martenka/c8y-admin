import { Partial, Record, Array, Number, String, Static } from 'runtypes';

export const ApiResponseErrorRuntype = Record({
  statusCode: Number,
}).And(
  Partial({
    message: String.Or(Array(String)),
    error: String,
  }),
);

export type ApiResponseErrorRuntypeType = Static<
  typeof ApiResponseErrorRuntype
>;
