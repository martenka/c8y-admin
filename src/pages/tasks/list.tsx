import React from 'react';
import { useDataGrid, List, ShowButton } from '@refinedev/mui';
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
  Stack,
} from '@mui/material';
import {
  DateTimePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
} from 'react-hook-form-mui';
import { useForm } from '@refinedev/react-hook-form';
import { ApiResponseErrorType } from '../../utils/error';
import {
  TaskFilterVariables,
  TrueFalseSelectOptions,
  TrueFalseArray,
} from '../../types/filters';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  getBooleanValue,
  paramsToSimpleCrudFilters,
} from '../../utils/transforms';
import { useNavigate } from 'react-router-dom';
import {
  BaseTask,
  TaskStatusArray,
  TaskStatusSelectOptions,
  TaskTypesArray,
  TaskTypesSelectOptions,
} from '../../types/tasks/base';

export const TasksList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = auth.data?.token;
  const isAdmin = auth.data?.isAdmin;

  const navigate = useNavigate();

  const { dataGridProps, filters, search } = useDataGrid<
    BaseTask,
    ApiResponseErrorType,
    TaskFilterVariables
  >({
    meta: {
      token,
    },
    onSearch: (initialParams) => {
      const params: Record<
        keyof TaskFilterVariables,
        string | number | boolean | undefined
      > = {
        ...initialParams,
        isPeriodic:
          typeof initialParams.isPeriodic === 'number'
            ? getBooleanValue(TrueFalseArray[initialParams.isPeriodic])
            : undefined,
        taskStatus:
          typeof initialParams.taskStatus === 'number'
            ? TaskStatusArray[initialParams.taskStatus]
            : undefined,
        taskType:
          typeof initialParams.taskType === 'number'
            ? TaskTypesArray[initialParams.taskType]
            : undefined,
        firstRunAt: initialParams.firstRunAt?.toISOString(),
      };
      const filters: CrudFilters = [];
      if (notNil(params)) {
        paramsToSimpleCrudFilters(params, filters);
      }

      return filters;
    },
    queryOptions: {
      retry: false,
      refetchInterval: 5000,
    },
  });

  const columns = React.useMemo<GridColumns<BaseTask>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'taskType', headerName: 'Type', flex: 1 },
      { field: 'status', headerName: 'Status', flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: function render(props) {
          return (
            <>
              <ShowButton hideText recordItemId={props.row.id} />
            </>
          );
        },
      },
    ],
    [],
  );

  const { handleSubmit, control, reset, ...rest } = useForm<
    BaseTask,
    ApiResponseErrorType,
    TaskFilterVariables
  >({
    defaultValues: {
      id: getDefaultFilter('id', filters, 'eq'),
      taskType: getDefaultFilter('taskType', filters, 'eq'),
      name: getDefaultFilter('name', filters, 'eq'),
      taskStatus: getDefaultFilter('taskStatus', filters, 'eq'),
      firstRunAt: null,
      isPeriodic: getDefaultFilter('isPeriodic', filters, 'eq'),
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
              <Stack direction={'column'} spacing={3}>
                <TextFieldElement name="id" label="Id" size="small" fullWidth />
                <TextFieldElement
                  name="name"
                  label="Name"
                  size="small"
                  fullWidth
                />
                <SelectElement
                  name="taskType"
                  label="Task Type"
                  size="small"
                  options={TaskTypesSelectOptions}
                  fullWidth
                />
                <SelectElement
                  name="taskStatus"
                  label="Task Status"
                  size="small"
                  options={TaskStatusSelectOptions}
                  fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                  <DateTimePickerElement
                    name={'firstRunAt'}
                    label="First run from"
                    format={'DD/MM/YYYY HH:mm:ss'}
                    fullWidth
                  />
                </LocalizationProvider>
                <SelectElement
                  name="isPeriodic"
                  label="Periodic task"
                  size="small"
                  options={TrueFalseSelectOptions}
                  fullWidth
                />
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
            return (
              <>
                {isAdmin && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate('/tasks/create', {
                        state: { taskType: 'OBJECT_SYNC' },
                      });
                    }}
                  >
                    Sync sensors and groups
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
            autoHeight
          />
        </List>
      </Grid>
    </Grid>
  );
};
