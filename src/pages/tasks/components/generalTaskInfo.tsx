import { TaskProps } from '../helpers/types';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

export const GeneralTaskInfo = ({ task }: TaskProps) => {
  return (
    <Card>
      <CardHeader title="General" />
      <CardContent>
        <Stack direction={'column'} spacing={2}>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Name</Typography>
            <Typography>{task.name}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Local task ID</Typography>
            <Typography>{task.id}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Type</Typography>
            <Typography>{task.taskType}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold" alignItems="center" display="flex">
              Status
            </Typography>
            <Chip label={task.status} variant="filled" />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold" alignItems="center" display="flex">
              Mode
            </Typography>
            <Chip label={task.mode} variant="filled" />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Created At</Typography>
            <Typography>{task.createdAt}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
