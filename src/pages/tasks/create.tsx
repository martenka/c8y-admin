import { Create } from '@refinedev/mui';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useGetIdentity, useNotification } from '@refinedev/core';
import { useLocation } from 'react-router-dom';
import { useForm } from '@refinedev/react-hook-form';
import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import {
  Control,
  DateTimePickerElement,
  FormContainer,
  SelectElement,
  SelectElementProps,
  TextFieldElement,
} from 'react-hook-form-mui';
import React, { useState } from 'react';
import { ApiResponseErrorType, CustomError } from '../../utils/error';
import {
  TaskPayload,

} from '../../types/tasks/task';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DataFetchTaskFields,
  DataUploadTaskFields,
  ObjectSyncTaskFields,
} from './fields';
import {
  getTaskTypeAndDefaultValues,
  taskSubmitHandler,
} from './helpers/helpers';
import {TaskTypes, TaskTypesArray, TaskTypesSelectOptions} from "../../types/tasks/base";

interface PeriodicTaskUIState {
  isPeriodic: boolean;
  lg: number;
}

export interface GeneralTaskFormFieldsProps {
  periodicTaskState: PeriodicTaskUIState;
  taskTypes: Required<SelectElementProps<object>>['options'];
  selectedTask: TaskTypes;
}

export const TaskCreate = () => {
  const [periodicTaskState, setPeriodicTaskState] =
    useState<PeriodicTaskUIState>({
      isPeriodic: false,
      lg: 6,
    });

  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const notification = useNotification();
  const locationState = useLocation().state;
  const inputData = getTaskTypeAndDefaultValues(locationState);

  const { handleSubmit, control, ...formRest } = useForm<
    TaskPayload,
    ApiResponseErrorType,
    TaskPayload
  >({
    refineCoreProps: { meta: { token } },
    defaultValues: {
      ...inputData.defaultValues,
    },
  });

  return (
    <Create
      title={<Typography variant="h5">Create task</Typography>}
      saveButtonProps={{
        ...formRest.saveButtonProps,
        onClick: async () => {
          try {
            const mappedFormData = taskSubmitHandler(formRest.getValues());
            await formRest.refineCore.onFinish(
              mappedFormData as unknown as TaskPayload,
            );
          } catch (e) {
            if (e instanceof CustomError) {
              notification.open?.({ type: 'error', message: e.message });
            } else {
              throw e;
            }
          }
        },
      }}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          {inputData.type === 'DATA_FETCH' && (
            <FormControlLabel
              control={
                <Checkbox
                  value={periodicTaskState}
                  onChange={() =>
                    setPeriodicTaskState((prevState) => ({
                      isPeriodic: !prevState.isPeriodic,
                      lg: prevState.lg >= 6 ? 12 : 6,
                    }))
                  }
                />
              }
              label={'Periodic'}
            />
          )}
        </>
      )}
    >
      <FormContainer formContext={{ handleSubmit, control, ...formRest }}>
        <GeneralTaskFormFields
          periodicTaskState={periodicTaskState}
          taskTypes={TaskTypesSelectOptions}
          selectedTask={TaskTypesArray[formRest.getValues('taskType')]}
        />
        <TaskPayloadFormFieldsSwitcher
          taskType={inputData.type}
          control={control}
        />
      </FormContainer>
    </Create>
  );
};

export const GeneralTaskFormFields = ({
  periodicTaskState,
  taskTypes,
  selectedTask,
}: GeneralTaskFormFieldsProps): JSX.Element => {
  return (
    <Grid container spacing={2} marginBottom={2}>
      <Grid item xs={12} lg={periodicTaskState.isPeriodic}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body1" fontWeight="bold">
            General task information
          </Typography>
          <SelectElement
            name={'taskType'}
            fullWidth
            options={taskTypes}
            disabled={true}
          />
          <TextFieldElement name={`name`} label="Task name" fullWidth />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePickerElement
              name={'firstRunAt'}
              label="First run at"
              fullWidth
              format={'DD/MM/YYYY HH:mm:ss'}
            />
          </LocalizationProvider>
        </Stack>
      </Grid>
      {periodicTaskState.isPeriodic && (
        <Grid item xs={12} lg={6}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1" fontWeight="bold">
              Periodic task information
            </Typography>
            <TextFieldElement name={'pattern'} label="Pattern" />
            {selectedTask === 'DATA_FETCH' && (
              <TextFieldElement
                type="number"
                name={'fetchDurationSeconds'}
                label="Duration (seconds)"
              />
            )}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};

export const TaskPayloadFormFieldsSwitcher = ({
  taskType,
  control,
}: {
  taskType: TaskTypes;
  control: Control<TaskPayload>;
}): JSX.Element | null => {
  switch (taskType) {
    case 'DATA_FETCH':
      return <DataFetchTaskFields control={control} />;
    case 'OBJECT_SYNC':
      return <ObjectSyncTaskFields control={control} />;
    case 'DATA_UPLOAD':
      return <DataUploadTaskFields control={control} />;
  }
  return null;
};
