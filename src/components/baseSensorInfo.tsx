import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { Sensor } from '../types/sensors';
import { notNil } from '../utils/validators';
import { ShowButton } from '@refinedev/mui';
interface BaseSensorInfoProps {
  sensor: Partial<Sensor>;
  sensorIdFallback?: string;
}
export const BaseSensorInfo = ({
  sensor,
  sensorIdFallback,
}: BaseSensorInfoProps) => {
  const sensorId = sensor.id ?? sensorIdFallback;
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
                <Stack direction={'row'} spacing={2}>
                  <Typography>{sensorId}</Typography>
                  {notNil(sensorId) && (
                    <ShowButton
                      sx={{ padding: 0 }}
                      hideText
                      resource={'sensors'}
                      recordItemId={sensorId}
                    />
                  )}
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">ManagedObject ID</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensor.managedObjectId}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">ManagedObject Name</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensor.managedObjectName}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Fragment Type</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensor.valueFragmentType}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Fragment Description</Typography>
              </TableCell>
              <TableCell>
                <Typography>{sensor.valueFragmentDisplayName}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
