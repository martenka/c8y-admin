import { TaskProps } from '../helpers/types';
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

export const TaskMetadata = ({ task }: TaskProps) => {
  const metadata = task.metadata;

  return (
    <Card>
      <CardHeader title="Task Metadata" />
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Stack direction={'column'} spacing={2} flex={1}>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">Periodic Task</Typography>
              <Typography>
                {metadata?.periodicData ? 'True' : 'False'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">Last Ran At</Typography>
              <Typography>{metadata?.lastRanAt}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">Last Completed At</Typography>
              <Typography>{metadata?.lastCompletedAt}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">First Run At</Typography>
              <Typography>{metadata?.firstRunAt}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">Pattern</Typography>
              <Typography>{metadata?.periodicData?.pattern}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">Fetch Duration</Typography>
              <Typography>
                {metadata?.periodicData && (
                  <span>
                    {metadata?.periodicData?.fetchDurationSeconds} seconds
                  </span>
                )}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={'column'} spacing={2} flex={1}>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">Last Failed At</Typography>
              <Typography>{metadata?.lastFailedAt}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography fontWeight="bold">Last Fail Reason</Typography>
              <Typography>{metadata?.lastFailReason}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
