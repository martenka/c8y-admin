import React from 'react';
import { useGetIdentity, useShow } from '@refinedev/core';
import { UserIdentity } from '../../types/auth';
import { Show } from '@refinedev/mui';
import { Grid } from '@mui/material';
import { Task } from '../../types/tasks/task';
import { GeneralTaskInfo } from './components/generalTaskInfo';
import { isNil } from '../../utils/validators';
import { TaskMetadata } from './components/taskMetadata';
import { TaskProps } from './helpers/types';
import { getTaskType } from './helpers/helpers';
import { DataFetchTaskRuntype } from '../../types/tasks/data-fetch';
import { DataFetchTaskPayload } from './components/dataFetchTaskPayload';
import { DataUploadTaskRuntype } from '../../types/tasks/data-upload';
import { DataUploadTaskPayload } from './components/dataUploadTaskPayload';

export const TaskShow = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = auth.data?.token ?? undefined;

  const { queryResult } = useShow<Task>({
    meta: {
      token,
    },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  if (isNil(record)) {
    return null;
  }
  return (
    <Show isLoading={isLoading} canEdit={false}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <GeneralTaskInfo task={record} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TaskMetadata task={record} />
        </Grid>
        <TaskPayloadSwitcher task={record} />
      </Grid>
    </Show>
  );
};

const TaskPayloadSwitcher = ({ task, token }: TaskProps) => {
  const taskType = getTaskType(task);

  if (taskType === 'DATA_FETCH' && DataFetchTaskRuntype.guard(task)) {
    return <DataFetchTaskPayload task={task} token={token} />;
  }
  if (taskType === 'DATA_UPLOAD' && DataUploadTaskRuntype.guard(task)) {
    return <DataUploadTaskPayload task={task} token={token} />;
  }

  return null;
};
