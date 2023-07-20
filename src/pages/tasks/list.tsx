import React, { useState } from 'react';
import { useDataGrid, List, ShowButton } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import {
  CrudFilters,
  getDefaultFilter,
  useCustomMutation,
  useGetIdentity,
} from '@refinedev/core';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
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
  TaskModesArray,
  TaskModesMap,
  TaskStatusArray,
  TaskStatusSelectOptions,
  TaskTypesArray,
  TaskTypesSelectOptions,
} from '../../types/tasks/base';

import { PlayArrow, Stop } from '@mui/icons-material';

export const TasksList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = auth.data?.token;
  const isAdmin = auth.data?.isAdmin;

  const navigate = useNavigate();

  const { mutate: taskModeMutation } = useCustomMutation();
  const [listSelection, setListSelection] = useState<BaseTask[]>([]);

  const { dataGridProps, filters, search, tableQueryResult } = useDataGrid<
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

  const columns = React.useMemo<GridColDef<BaseTask>[]>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'taskType', headerName: 'Type', flex: 1 },
      { field: 'status', headerName: 'Status', flex: 1 },
      { field: 'mode', headerName: 'Mode', flex: 1 },
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

  const dataGridData = tableQueryResult.data?.data ?? [];

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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                  <>
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
                    <IconButton
                      onClick={() => {
                        taskModeMutation({
                          method: 'put',
                          url: 'tasks/mode',
                          values: {
                            type: TaskModesArray[TaskModesMap['DISABLED']],
                            taskIds: listSelection.map((item) => item.id),
                          },
                          meta: { token },
                          successNotification: {
                            message: 'Tasks disabled',
                            type: 'success',
                          },
                        });
                      }}
                    >
                      <Stop fontSize="large" htmlColor="red" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        taskModeMutation({
                          method: 'put',
                          url: 'tasks/mode',
                          values: {
                            type: TaskModesArray[TaskModesMap['ENABLED']],
                            taskIds: listSelection.map((item) => item.id),
                          },
                          meta: { token },
                          successNotification: {
                            message: 'Tasks enabled',
                            type: 'success',
                          },
                        });
                      }}
                    >
                      <PlayArrow fontSize="large" color="primary" />
                    </IconButton>
                  </>
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
            onRowSelectionModelChange={(model) => {
              const selectedIds = new Set(model);
              const selectedItems = dataGridData.filter((item) =>
                selectedIds.has(item.id),
              );
              setListSelection(selectedItems);
            }}
            autoHeight
          />
        </List>
      </Grid>
    </Grid>
  );
};
