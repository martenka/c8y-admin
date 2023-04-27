import { DataFetchTask } from '../../../types/tasks/data-fetch';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DateCard } from '../../../components/dateCard';
import { ShowButton } from '@refinedev/mui';

interface DataFetchTaskPayloadProps {
  task: DataFetchTask;
  token?: string;
}
export const DataFetchTaskPayload = (props: DataFetchTaskPayloadProps) => {
  const payload = props.task.payload;
  return (
    <>
      <Grid item xs={12} lg={9}>
        <Card>
          <CardHeader title="Payload" />
          <CardContent>
            <Typography>
              Data in this table is not updated after task has completed
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell key="sensor">Sensor</TableCell>
                  <TableCell key="fileId">File ID</TableCell>
                  <TableCell key="name">File Name</TableCell>
                  <TableCell key="bucket">File Storage Bucket</TableCell>
                  <TableCell key="path">File Path In Bucket</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payload.data.map((file) => {
                  const rowId =
                    typeof file.sensor === 'string'
                      ? file.sensor
                      : file.sensor.id;
                  return (
                    <TableRow key={`sensor.${rowId}`}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {file.sensor.toString()}
                          {
                            <ShowButton
                              hideText
                              recordItemId={rowId}
                              resource="sensors"
                              meta={{ token: props.token }}
                            />
                          }
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {file.fileId}
                          {file.fileId && (
                            <ShowButton
                              hideText
                              recordItemId={file.fileId}
                              resource="files"
                              meta={{ token: props.token }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>{file.fileName}</TableCell>
                      <TableCell>{file.bucket}</TableCell>
                      <TableCell>
                        <Typography sx={{ wordBreak: 'break-all' }}>
                          {file.filePath}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={3}>
        <Stack direction="row" spacing={2}>
          <DateCard dateFrom={payload.dateFrom} dateTo={payload.dateTo} />
        </Stack>
      </Grid>
    </>
  );
};
