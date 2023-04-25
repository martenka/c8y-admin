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

interface DateCardProps {
  dateFrom?: string;
  dateTo?: string;
  elevation?: number;
}

export const DateCard = (props: DateCardProps) => {
  const { dateFrom, dateTo, ...rest } = props;
  return (
    <Card {...rest}>
      <CardHeader title="Data date range" />
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">From</Typography>
              </TableCell>
              <TableCell>
                <Typography>{dateFrom}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">To</Typography>
              </TableCell>
              <TableCell>
                <Typography>{dateTo}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
