import React from 'react';
import { useDataGrid, List } from '@refinedev/mui';
import { DataGrid, GridColumns } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { useGetIdentity } from '@refinedev/core';
import { Task } from '../../types/task';

export const TasksList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const { dataGridProps } = useDataGrid<Task>({
    meta: {
      token,
    },
  });

  const columns = React.useMemo<GridColumns<Task>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'taskType', headerName: 'Type', flex: 1 },
      { field: 'status', headerName: 'Status', flex: 1 },
    ],
    [],
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
