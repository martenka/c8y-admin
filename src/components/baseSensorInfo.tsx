import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { Sensor } from '../types/sensors';
interface BaseSensorInfoProps {
  sensor: Partial<Sensor>;
  sensorIdFallback?: string;
}
export const BaseSensorInfo = ({
  sensor,
  sensorIdFallback,
}: BaseSensorInfoProps) => {
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
                <Typography>{sensor.id ?? sensorIdFallback}</Typography>
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
