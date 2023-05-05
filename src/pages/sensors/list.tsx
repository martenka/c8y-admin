import React, { useState } from 'react';
import { useDataGrid, List, ShowButton } from '@refinedev/mui';
import { DataGrid, GridColumns } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { CrudFilters, getDefaultFilter, useGetIdentity } from '@refinedev/core';
import { Sensor } from '../../types/sensors';
import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { ApiResponseErrorType } from '../../utils/error';
import {
  SearchTypesWithoutTokenSelectOptions,
  SensorFilterVariables,
} from '../../types/filters';
import { useForm } from '@refinedev/react-hook-form';
import { useNavigate } from 'react-router-dom';
import { paramsToSimpleCrudFilters } from '../../utils/transforms';
import { CustomAttributesFilter } from '../../components/customAttributesFilter';
import { addSearchTypeIfNotFirstOption } from '../../utils/helpers';

export const SensorsList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = auth.data?.token;
  const isAdmin = auth.data?.isAdmin;

  const navigate = useNavigate();

  const [listSelection, setListSelection] = useState<Sensor[]>([]);

  const { dataGridProps, search, filters, tableQueryResult } = useDataGrid<
    Sensor,
    ApiResponseErrorType,
    SensorFilterVariables
  >({
    meta: {
      token,
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];

      if (notNil(params)) {
        const { searchType, ...rest } = params;
        paramsToSimpleCrudFilters(rest, filters);
        addSearchTypeIfNotFirstOption(filters, searchType);
      }

      return filters;
    },
    queryOptions: {
      retry: false,
    },
  });

  const dataGridData = tableQueryResult.data?.data ?? [];

  const columns = React.useMemo<GridColumns<Sensor>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'managedObjectId', headerName: 'ManagedObject', flex: 1 },
      { field: 'managedObjectName', headerName: 'ManagedObjectName', flex: 1 },
      { field: 'valueFragmentType', headerName: 'FragmentType', flex: 1 },
      {
        field: 'valueFragmentDisplayName',
        headerName: 'FragmentIdentifier',
        flex: 1,
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
      },
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
    Sensor,
    ApiResponseErrorType,
    SensorFilterVariables
  >({
    defaultValues: {
      id: getDefaultFilter('id', filters, 'eq'),
      managedObjectId: getDefaultFilter('managedObjectId', filters, 'eq'),
      managedObjectName: getDefaultFilter('managedObjectName', filters, 'eq'),
      valueFragmentType: getDefaultFilter('valueFragmentType', filters, 'eq'),
      valueFragmentDisplayName: getDefaultFilter(
        'valueFragmentDisplayName',
        filters,
        'eq',
      ),
      searchType: 0,
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
              defaultValues={{
                id: undefined,
                valueFragmentType: undefined,
                valueFragmentDisplayName: undefined,
                managedObjectId: undefined,
                managedObjectName: undefined,
                customAttributes: [{ key: '', value: '' }],
              }}
              handleSubmit={handleSubmit(search)}
            >
              <TextFieldElement
                name="query"
                label="Token query"
                margin="normal"
                size="small"
                fullWidth
              />
              <SelectElement
                name="searchType"
                label="Search type"
                margin="normal"
                size="small"
                options={SearchTypesWithoutTokenSelectOptions}
                fullWidth
              />
              <TextFieldElement
                name="id"
                label="Id"
                margin="normal"
                size="small"
                fullWidth
              />
              <TextFieldElement
                name="valueFragmentType"
                label="ValueFragmentType"
                margin="normal"
                size="small"
                fullWidth
              />
              <TextFieldElement
                name="valueFragmentDisplayName"
                label="ValueFragmentDisplayName"
                margin="normal"
                size="small"
                fullWidth
              />
              <TextFieldElement
                name="managedObjectId"
                label="ManagedObjectId"
                margin="normal"
                size="small"
                fullWidth
              />
              <TextFieldElement
                name="managedObjectName"
                label="ManagedObjectName"
                margin="normal"
                size="small"
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
        <List
          headerButtons={({ defaultButtons }) => {
            return (
              <>
                {defaultButtons}
                {isAdmin && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate('/tasks/create', {
                        state: {
                          taskType: 'DATA_FETCH',
                          sensors: listSelection,
                        },
                      });
                    }}
                  >
                    Fetch sensor data
                  </Button>
                )}
              </>
            );
          }}
        >
          <DataGrid
            {...dataGridProps}
            columns={columns}
            filterModel={undefined}
            checkboxSelection
            onSelectionModelChange={(model) => {
              const selectedIds = new Set(model);
              const selectedSensors = dataGridData.filter((item) =>
                selectedIds.has(item.id),
              );
              setListSelection(selectedSensors);
            }}
            autoHeight
          />
        </List>
      </Grid>
    </Grid>
  );
};
