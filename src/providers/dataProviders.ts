import {
  BaseKey,
  CreateResponse,
  CrudFilters,
  CrudSorting,
  DataProvider,
  DeleteOneResponse,
  GetListResponse,
  GetManyResponse,
  GetOneResponse,
  MetaQuery,
  Pagination,
  UpdateResponse,
} from '@refinedev/core';
import { getAuthHeader } from '../utils/auth';

import { GeneralApiResponse } from '../types/general';
import { isNil, notNil } from '../utils/validators';
import { ApiResponseErrorRuntype } from '../types/error';
import { ApiResponseError } from '../utils/error';

export type ApiMetaQuery = MetaQuery & { token: string | undefined };

export const createBaseDataProvider = (baseUrl: string): DataProvider => {
  return {
    async create<TData, TVariables>(_params: {
      resource: string;
      variables: TVariables;
      meta?: MetaQuery;
      metaData?: MetaQuery;
    }): Promise<CreateResponse<TData>> {
      return Promise.resolve({ data: {} as TData });
    },
    async deleteOne<TData, TVariables>(params: {
      resource: string;
      id: BaseKey;
      variables?: TVariables;
      meta?: MetaQuery;
      metaData?: MetaQuery;
    }): Promise<DeleteOneResponse<TData>> {
      const url = new URL(`${params.resource}/${params.id}`, baseUrl);
      const token = (params.meta as ApiMetaQuery)?.token as string;

      const response = await fetch(url, {
        headers: { ...getAuthHeader(token) },
      });

      const responsePayload = await getResponseJsonOrUndefined(response);
      checkApiError(response, responsePayload);
      return { data: responsePayload as TData };
    },
    getApiUrl(): string {
      return baseUrl;
    },
    async getList<TData>(params: {
      resource: string;
      pagination?: Pagination;
      sorters?: CrudSorting;
      filters?: CrudFilters;
      meta?: MetaQuery;
      metaData?: MetaQuery;
      dataProviderName?: string;
    }): Promise<GetListResponse<TData>> {
      const url = new URL(`${params.resource}/search`, baseUrl);
      setPaginationQueryParams(url, params.pagination);

      const token = (params.meta as ApiMetaQuery)?.token as string;

      if (isNil(token)) {
        throw new Error('Unable to get user auth token');
      }

      const response = await fetch(url, {
        headers: { ...getAuthHeader(token) },
      });

      const responsePayload =
        await getResponseJsonOrUndefined<GeneralApiResponse>(response);

      checkApiError(response, responsePayload);
      return {
        data: responsePayload?.data as TData[],
        total: responsePayload?.pageInfo?.totalElements ?? 0,
      };
    },
    async getOne<TData>(params: {
      resource: string;
      id: BaseKey;
      meta?: MetaQuery;
      metaData?: MetaQuery;
    }): Promise<GetOneResponse<TData>> {
      const url = new URL(`${params.resource}/${params.id}`, baseUrl);
      const token = (params.meta as ApiMetaQuery)?.token as string;
      if (isNil(token)) {
        throw new Error('Unable to get user auth token');
      }

      const response = await fetch(url, {
        headers: { ...getAuthHeader(token) },
      });

      const responsePayload = await getResponseJsonOrUndefined<
        Record<string | number, unknown>
      >(response);

      checkApiError(response, responsePayload);
      return { data: responsePayload as TData };
    },
    async getMany<TData>(_params: {
      resource: string;
      ids: BaseKey[];
      meta?: MetaQuery;
      dataProviderName?: string;
    }): Promise<GetManyResponse<TData>> {
      return { data: [] };
    },
    async update<TData, TVariables>(params: {
      resource: string;
      id: BaseKey;
      variables: TVariables;
      meta?: MetaQuery;
      metaData?: MetaQuery;
    }): Promise<UpdateResponse<TData>> {
      const url = new URL(`${params.resource}/${params.id}`, baseUrl);
      const token = (params.meta as ApiMetaQuery)?.token as string;

      if (isNil(token)) {
        throw new Error('Unable to get user auth token');
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.variables),
      });

      const responsePayload = await getResponseJsonOrUndefined(response);
      checkApiError(response, responsePayload);
      return { data: responsePayload as TData };
    },
  };
};

function setPaginationQueryParams(
  url: URL,
  pagination: Pagination | undefined,
) {
  if (isNil(pagination)) {
    return;
  }
  if (pagination.mode === 'server') {
    if (notNil(pagination.current)) {
      url.searchParams.set('currentPage', pagination.current?.toString());
    }
    if (notNil(pagination.pageSize)) {
      url.searchParams.set('pageSize', pagination.pageSize.toString());
    }
  }
  url.searchParams.set('withTotalElements', 'true');
}

async function getResponseJsonOrUndefined<T>(
  response: Response,
): Promise<T | undefined> {
  try {
    return (await response.json()) as T;
  } catch (e) {
    return undefined;
  }
}

function checkApiError<T>(response: Response, responsePayload: T) {
  if (ApiResponseErrorRuntype.guard(responsePayload)) {
    throw new ApiResponseError({
      error: responsePayload.error,
      statusCode: responsePayload.statusCode,
      message: responsePayload.message,
    });
  } else if (response.status > 399) {
    console.error(responsePayload, response.status, response.statusText);
    throw new ApiResponseError({
      statusCode: response.status,
      message: `${response.status}, ${response.statusText}`,
    });
  }
}
