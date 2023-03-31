import { ApiResponseErrorRuntypeType } from '../types/error';

export type ApiResponseErrorType = Omit<
  ApiResponseErrorRuntypeType,
  'message'
> & {
  message: string;
  errorMessage?: string | string[];
};

/**
 * ApiResponseError has default values of:
 *  statusCode = -1,<br>
 *  error = '', <br>
 *  message = '',
 */
export class ApiResponseError extends Error implements ApiResponseErrorType {
  statusCode;
  error?;
  errorMessage: string | string[] = '';
  constructor({ error, statusCode, message }: ApiResponseErrorRuntypeType) {
    super(String(message));
    this.statusCode = statusCode ?? -1;
    this.error = error ?? '';
    this.errorMessage = message ?? '';
  }
}
