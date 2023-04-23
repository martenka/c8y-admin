import { Show, ShowButton } from '@refinedev/mui';
import { useGetIdentity, useShow } from '@refinedev/core';
import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { File } from '../../types/files';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { FileVisibilityButton } from './components/visibility-button';
import { FileDownload } from '@mui/icons-material';
import React from 'react';

interface FileCardProps {
  file?: File;
  token?: string;
}

export const FileShow = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = auth.data?.token ?? undefined;

  const { queryResult } = useShow<File>({
    meta: {
      token,
    },
    queryOptions: {
      refetchInterval: 5000,
    },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show
      isLoading={isLoading}
      canEdit={false}
      headerButtons={({ defaultButtons }) => (
        <>
          {record?.url && (
            <IconButton sx={{ padding: 0 }}>
              <Link href={record.url} download>
                <FileDownload />
              </Link>
            </IconButton>
          )}
          {defaultButtons}
        </>
      )}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <FileGeneralInfo file={record} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FileStorageInfo file={record} token={token} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FileSensorInfo file={record} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FileDateInfo file={record} />
        </Grid>
      </Grid>
    </Show>
  );
};

export const FileGeneralInfo = (props: FileCardProps) => {
  const file = props?.file;
  return (
    <Card>
      <CardHeader title="General" />
      <CardContent>
        <Stack direction={'column'} spacing={2}>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Name</Typography>
            <Typography>{file?.name}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Local file ID</Typography>
            <Typography>{file?.id}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Created by task</Typography>
            <Typography>{file?.createdByTask}</Typography>
            {notNil(file?.createdByTask) && (
              <ShowButton
                sx={{ padding: 0 }}
                hideText
                resource={'tasks'}
                recordItemId={file?.createdByTask}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Date created</Typography>
            <Typography>{file?.createdAt}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Description</Typography>
            <Typography>{file?.description}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const FileStorageInfo = (props: FileCardProps) => {
  const file = props?.file;
  return (
    <Card>
      <CardHeader title="Storage" />
      <CardContent>
        <Stack direction={'column'} spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography fontWeight="bold">Visibility</Typography>
            {file && props.token && (
              <FileVisibilityButton
                visibilityState={file.visibilityState}
                fileId={file.id}
                token={props.token}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Bucket</Typography>
            <Typography>{file?.storage?.bucket}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">Path</Typography>
            <Typography>{file?.storage?.path}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography fontWeight="bold">URL</Typography>
            <Typography>{file?.url}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const FileDateInfo = (props: FileCardProps) => {
  const file = props?.file;
  return (
    <Card>
      <CardHeader title="Data date range" />
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">From</Typography>
              </TableCell>
              <TableCell>
                <Typography>{file?.metadata?.dateFrom}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">To</Typography>
              </TableCell>
              <TableCell>
                <Typography>{file?.metadata?.dateTo}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const FileSensorInfo = (props: FileCardProps) => {
  const sensorData = props?.file?.metadata;
  return (
    <Card>
      <CardHeader title="Sensor" />
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Local sensor ID</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensorData?.sensors?.[0]}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">ManagedObject ID</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensorData?.managedObjectId}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">ManagedObject Name</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensorData?.managedObjectName}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Fragment Type</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensorData?.valueFragments?.[0].type}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Fragment Description</Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {sensorData?.valueFragments?.[0].description}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
