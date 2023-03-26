import React from 'react';
import { useDataGrid, List } from '@refinedev/mui';
import { DataGrid, GridColumns } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { useGetIdentity } from '@refinedev/core';
import { User } from '../../types/users';

export const UsersList = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const { dataGridProps } = useDataGrid<User>({
    meta: {
      token,
    },
  });

  const columns = React.useMemo<GridColumns<User>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'username', headerName: 'Username', flex: 1 },
      {
        field: 'roles',
        headerName: 'Roles',
        valueFormatter: (_params) => {
          return 'Placeholder';
        },
        flex: 1,
      },
    ],
    [],
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
