import React from 'react';
import { useDataGrid, List, ShowButton } from '@refinedev/mui';
import { DataGrid, GridColumns } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { isNil, notNil } from '../../utils/validators';
import { CrudFilters, getDefaultFilter, useGetIdentity } from '@refinedev/core';
import { Sensor } from '../../types/sensors';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Controller,
  FormContainer,
  TextFieldElement,
  useFieldArray,
} from 'react-hook-form-mui';
import { ApiResponseErrorType } from '../../utils/error';
import { SensorFilterVariables } from '../../types/filters';
import { useForm } from '@refinedev/react-hook-form';

export const SensorsList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const { dataGridProps, search, filters } = useDataGrid<
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
        Object.keys(params).forEach((key) => {
          const value = params[key];
          if (isNil(value) || (Array.isArray(value) && value.length === 0)) {
            return;
          }
          filters.push({
            field: key,
            operator: 'eq',
            value: value !== '' ? params[key] : undefined,
          });
        });
      }

      return filters;
    },
  });

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
      customAttributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray<
    SensorFilterVariables,
    'customAttributes'
  >({
    control,
    name: 'customAttributes',
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
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                Custom Attributes
              </Typography>
              {fields.map((field, index) => {
                return (
                  <Stack
                    direction="row"
                    spacing={1}
                    key={`${field.id}`}
                    marginBottom={2}
                  >
                    <Controller
                      control={control}
                      key={`customAttributes.${index}.key`}
                      name={`customAttributes.${index}.key`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          label={`Key`}
                        />
                      )}
                    />
                    <Controller
                      key={`customAttributes.${index}.value`}
                      control={control}
                      name={`customAttributes.${index}.value`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          label={`Value`}
                        />
                      )}
                    />
                    {/*                    <TextField
                      fullWidth
                      key={`customAttributes[${index}].key`}
                      name={`customAttributes.${index}.key`}
                      label={'key'}
                    />*/}
                    {/*    <TextField
                      fullWidth
                      key={`customAttributes2[${index}].value`}
                      name={`customAttributes.[${index}].value`}
                      label={'value'}
                    />*/}
                    <Button
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                );
              })}
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                fullWidth
                onClick={() => append({ key: '', value: '' })}
              >
                Add attribute
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                fullWidth
              >
                Filter
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
