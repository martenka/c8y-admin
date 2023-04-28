import React from 'react';
import { useDataGrid, List, ShowButton } from '@refinedev/mui';
import { DataGrid, GridColumns } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { CrudFilters, getDefaultFilter, useGetIdentity } from '@refinedev/core';
import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { ApiResponseErrorType } from '../../utils/error';
import {
  GroupFilterVariables,
  SearchTypesArray,
  SearchTypesMap,
  SearchTypesSelectOptions,
} from '../../types/filters';
import { useForm } from '@refinedev/react-hook-form';
import { paramsToSimpleCrudFilters } from '../../utils/transforms';
import { Group } from '../../types/group';
import { CustomAttributesFilter } from '../../components/customAttributesFilter';

export const GroupsList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const { dataGridProps, search, filters } = useDataGrid<
    Group,
    ApiResponseErrorType,
    GroupFilterVariables
  >({
    meta: {
      token,
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];

      if (notNil(params)) {
        const { searchType, ...rest } = params;
        paramsToSimpleCrudFilters(rest, filters);

        // First search type is the default setting, this does not need to be sent to backend
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

      return filters;
    },
    queryOptions: {
      retry: false,
    },
  });

  const columns = React.useMemo<GridColumns<Group>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Group name', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 1 },
      { field: 'sensorAmount', headerName: 'Sensors in group', flex: 1 },
      {
        field: 'action',
        headerName: 'Actions',
        renderCell: function render({ row }) {
          return (
            <>
              <ShowButton hideText recordItemId={row.id} />
            </>
          );
        },
        flex: 1,
      },
    ],
    [],
  );
  const { handleSubmit, control, reset, ...rest } = useForm<
    Group,
    ApiResponseErrorType,
    GroupFilterVariables
  >({
    defaultValues: {
      id: getDefaultFilter('id', filters, 'eq'),
      name: getDefaultFilter('name', filters, 'eq'),
      searchType: SearchTypesMap['EXACT'],
      customAttributes: [],
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <Card>
          <CardHeader title={'Filters'} />
          <CardContent>
            <FormContainer
              formContext={{ handleSubmit, control, reset, ...rest }}
              handleSubmit={handleSubmit(search)}
            >
              <TextFieldElement
                name="id"
                label="Id"
                margin="normal"
                size="small"
                fullWidth
              />
              <TextFieldElement
                name="name"
                label="Name"
                margin="normal"
                size="small"
                fullWidth
              />
              <SelectElement
                name="searchType"
                label="Search type"
                margin="normal"
                size="small"
                options={SearchTypesSelectOptions}
                fullWidth
              />
              <CustomAttributesFilter control={control} />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                fullWidth
              >
                Filter
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3 }}
                fullWidth
                onClick={() => reset()}
              >
                Clear Filters
              </Button>
            </FormContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={9}>
        <List>
          <DataGrid
            {...dataGridProps}
            columns={columns}
            filterModel={undefined}
            autoHeight
          />
        </List>
      </Grid>
    </Grid>
  );
};
