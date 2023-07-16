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
  DeleteManyResponse,
  BaseRecord,
  CrudFilter,
  CustomResponse,
} from '@refinedev/core';
import { getAuthHeader } from '../utils/auth';

import { GeneralApiResponse, KeyValuesRuntype } from '../types/general';
import { isNil, notNil } from '../utils/validators';
import { ApiResponseErrorRuntype } from '../types/error';
import { ApiResponseError } from '../utils/error';

export type ApiMetaQuery = MetaQuery & { token: string | undefined };

export const createBaseDataProvider = (baseUrl: string): DataProvider => {
  return {
    async create<TData, TVariables>(params: {
      resource: string;
      variables: TVariables;
      meta?: MetaQuery;
      metaData?: MetaQuery;
    }): Promise<CreateResponse<TData>> {
      const additionalPath = params.meta?.additionalPath;
      const path = notNil(additionalPath)
        ? `${params.resource}/${additionalPath}`
        : params.resource;
      const url = new URL(path, baseUrl);
      const token = (params.meta as ApiMetaQuery)?.token as string;

      if (isNil(token)) {
        throw new Error('Unable to get user auth token');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeader(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.variables),
      });

      const responsePayload = await getResponseJsonOrUndefined<
        Record<string | number, unknown>
      >(response);

      checkApiError(response, responsePayload);
      return { data: responsePayload as TData };
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

      if (isNil(token)) {
        throw new Error('Unable to get user auth token');
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { ...getAuthHeader(token) },
      });

      const responsePayload = await getResponseJsonOrUndefined(response);
      checkApiError(response, responsePayload);
      return { data: responsePayload as TData };
    },
    async deleteMany<TData, TVariables>(params: {
      resource: string;
      ids: BaseKey[];
      variables?: TVariables;
      meta?: MetaQuery;
    }): Promise<DeleteManyResponse<TData>> {
      const url = new URL(`${params.resource}/delete`, baseUrl);
      const token = (params.meta as ApiMetaQuery)?.token as string;

      if (isNil(token)) {
        throw new Error('Unable to get user auth token');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeader(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: params.ids.map((item) => item.toString()),
        }),
      });

      const responsePayload = await getResponseJsonOrUndefined(response);
      checkApiError(response, responsePayload);
      return {
        data: [],
      };
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
      setFilterQueryParams(url, params.filters);
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
      throw new Error('getMany not implemented!');
    },
    async update<TData, TVariables>(params: {
      resource: string;
      id: BaseKey;
      variables: TVariables;
      meta?: MetaQuery;
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
    async custom<
      TData extends BaseRecord = BaseRecord,
      TQuery = object,
      TPayload = unknown,
    >(params: {
      url: string;
      method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch';
      sorters?: CrudSorting;
      filters?: CrudFilter[];
      payload?: TPayload;
      query?: TQuery;
      headers?: Record<string, string>;
      meta?: MetaQuery;
    }): Promise<CustomResponse<TData>> {
      const url = new URL(params.url, baseUrl);

      const token = (params.meta as ApiMetaQuery)?.token as string;

      if (isNil(token)) {
        throw new Error('Unable to get user auth token');
      }

      const response = await fetch(url, {
        method: params.method.toUpperCase(),
        headers: {
          ...params.headers,
          ...getAuthHeader(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.payload),
      });

      const responsePayload = await getResponseJsonOrUndefined<
        Record<string | number, unknown>
      >(response);

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

function setFilterQueryParams(url: URL, filters: CrudFilters | undefined) {
  if (isNil(filters) || filters.length === 0) {
    return;
  }

  filters.forEach((filter) => {
    if ('field' in filter) {
      if (KeyValuesRuntype.guard(filter.value)) {
        const customAttributeFilters: string[] = [];
        filter.value.forEach((item) => {
          if (item.key.length > 0 && item.value.length > 0) {
            customAttributeFilters.push(`${item.key}=${item.value}`);
          }
        });
        if (customAttributeFilters.length > 0) {
          url.searchParams.set(
            'customAttributes',
            customAttributeFilters.join(','),
          );
        }
      } else {
        url.searchParams.set(filter.field, filter.value);
      }
    }
  });
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
