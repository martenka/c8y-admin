import React, { useState } from 'react';
import { useDataGrid, List, DeleteButton } from '@refinedev/mui';
import { DataGrid, GridColumns } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { CrudFilters, getDefaultFilter, useGetIdentity } from '@refinedev/core';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Link,
  Stack,
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { File } from '../../types/files';
import { ApiResponseErrorType } from '../../utils/error';
import { FileFilterVariables, UnknownAttributes } from '../../types/filters';
import { paramsToSimpleCrudFilters } from '../../utils/transforms';
import { useForm } from '@refinedev/react-hook-form';
import {
  DateTimePickerElement,
  FormContainer,
  TextFieldElement,
} from 'react-hook-form-mui';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DeleteManyButton } from '../../components/deleteManyButton';

export const FilesList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;
  const [listSelection, setListSelection] = useState<string[]>([]);

  const { dataGridProps, filters, search, tableQueryResult } = useDataGrid<
    File,
    ApiResponseErrorType,
    FileFilterVariables
  >({
    meta: {
      token,
    },
    onSearch: (inputParams) => {
      const filters: CrudFilters = [];
      const params: UnknownAttributes = {
        id: inputParams.id,
        name: inputParams.fileName,
        sensors: inputParams.sensorId,
        createdByTask: inputParams.createdByTask,
        dateFrom: inputParams.dateFrom?.toISOString(),
        dateTo: inputParams.dateTo?.toISOString(),
        managedObjectId: inputParams.managedObjectId,
        managedObjectName: inputParams.managedObjectName,
        valueFragmentType: inputParams.valueFragmentType,
        valueFragmentDisplayName: inputParams.valueFragmentDisplayName,
      };
      if (notNil(params)) {
        paramsToSimpleCrudFilters(params, filters);
      }

      return filters;
    },
    queryOptions: {
      retry: false,
    },
  });

  const { handleSubmit, control, reset, ...rest } = useForm<
    File,
    ApiResponseErrorType,
    FileFilterVariables
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
      fileName: getDefaultFilter('fileName', filters, 'eq'),
      createdByTask: getDefaultFilter('createdByTask', filters, 'eq'),
      dateFrom: null,
      dateTo: null,
      sensorId: getDefaultFilter('sensorId', filters, 'eq'),
    },
  });
  const columns = React.useMemo<GridColumns<File>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'createdByTask', headerName: 'CreatedByTask', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 1 },
      {
        field: 'action',
        headerName: 'Actions',
        align: 'center',
        flex: 1,
        renderCell: function render(props) {
          return (
            <>
              <IconButton>
                <Link href={props.row.url} download>
                  <FileDownload />
                </Link>
              </IconButton>
              <DeleteButton
                recordItemId={props.row.id}
                hideText={true}
                meta={{
                  token,
                }}
              />
            </>
          );
        },
      },
    ],
    [],
  );

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
              <Stack direction="column" spacing={2}>
                <TextFieldElement
                  name="id"
                  label="File ID"
                  size="small"
                  fullWidth
                />
                <TextFieldElement
                  name="sensorId"
                  label="Sensor ID"
                  size="small"
                  fullWidth
                />
                <TextFieldElement
                  name="createdByTask"
                  label="Created by task ID"
                  size="small"
                  fullWidth
                />
                <TextFieldElement
                  name="fileName"
                  label="Filename"
                  size="small"
                  fullWidth
                />
                <TextFieldElement
                  name="valueFragmentType"
                  label="ValueFragmentType"
                  size="small"
                  fullWidth
                />
                <TextFieldElement
                  name="valueFragmentDisplayName"
                  label="ValueFragmentDisplayName"
                  size="small"
                  fullWidth
                />
                <TextFieldElement
                  name="managedObjectId"
                  label="ManagedObjectId"
                  size="small"
                  fullWidth
                />

                <TextFieldElement
                  name="managedObjectName"
                  label="ManagedObjectName"
                  size="small"
                  fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                  <Stack direction={'row'} spacing={2}>
                    <DateTimePickerElement
                      name={'dateFrom'}
                      label="Date From"
                      format={'DD/MM/YYYY HH'}
                      sx={{ flex: 1 }}
                    />
                    <DateTimePickerElement
                      name={'dateTo'}
                      label="Date To"
                      format={'DD/MM/YYYY HH'}
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                </LocalizationProvider>
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
              </Stack>
            </FormContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={9}>
        <List
          headerButtons={() => {
            if (listSelection?.length > 0) {
              return <DeleteManyButton ids={listSelection} meta={{ token }} />;
            }

            return null;
          }}
        >
          <DataGrid
            {...dataGridProps}
            columns={columns}
            filterModel={undefined}
            checkboxSelection
            onSelectionModelChange={(model) => {
              setListSelection(model.map((item) => item.toString()));
            }}
            autoHeight
          />
        </List>
      </Grid>
    </Grid>
  );
};
