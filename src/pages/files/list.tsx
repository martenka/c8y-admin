import React from 'react';
import { useDataGrid, List } from '@refinedev/mui';
import { DataGrid, GridColumns } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { useGetIdentity } from '@refinedev/core';

export const FilesList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const { dataGridProps } = useDataGrid<File>({
    meta: {
      token,
    },
  });

  const columns = React.useMemo<GridColumns<File>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'createdByTask', headerName: 'CreatedByTask', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 1 },
    ],
    [],
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
