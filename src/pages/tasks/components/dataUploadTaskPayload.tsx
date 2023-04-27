import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ShowButton } from '@refinedev/mui';

import {
  DataUploadFile,
  DataUploadTask,
} from '../../../types/tasks/data-upload';
import React, { useState } from 'react';
import { BaseSensorInfo } from '../../../components/baseSensorInfo';
import { DateCard } from '../../../components/dateCard';
import { FileStorage } from '../../../types/files';

interface DataUploadTaskPayloadProps {
  task: DataUploadTask;
  token?: string;
}
export const DataUploadTaskPayload = (props: DataUploadTaskPayloadProps) => {
  const payload = props.task.payload;
  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Files" />
          <CardContent>
            <Typography>
              Data in this table is not updated after task has completed
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell key="fileName">File Name</TableCell>
                  <TableCell key="fileId">File ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payload.files.map((file) => {
                  return (
                    <DataUploadTaskRow
                      key={file.fileId}
                      data={file}
                      storage={file.storage}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

const DataUploadTaskRow = ({
  data,
  token,
  storage,
}: {
  data: DataUploadFile;
  token?: string;
  storage: FileStorage;
}) => {
  const [open, setOpen] = useState(false);
  const metadata = data.metadata;

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen((prevState) => !prevState)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{data.fileName}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            {data.fileId}
            {
              <ShowButton
                hideText
                recordItemId={data.fileId}
                resource="files"
                meta={{ token }}
              />
            }
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ borderBottom: 'unset' }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <BaseSensorInfo
                  sensor={{
                    managedObjectId: metadata?.managedObjectId,
                    managedObjectName: metadata?.managedObjectName,
                    valueFragmentType: metadata?.valueFragmentType,
                    valueFragmentDisplayName:
                      metadata?.valueFragmentDescription,
                  }}
                  sensorIdFallback={'Not shown here'}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DateCard
                  dateTo={metadata.dateTo}
                  dateFrom={metadata.dateFrom}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardHeader title="Storage" />
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography fontWeight="bold">
                              File Storage Bucket
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{storage.bucket}</Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography fontWeight="bold">
                              File Path In Bucket
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ wordBreak: 'break-all' }}>
                            <Typography>{storage.path}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
