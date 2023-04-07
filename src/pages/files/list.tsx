import React from 'react';
import { useDataGrid, List, ShowButton } from '@refinedev/mui';
import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';

import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { useDataProvider, useGetIdentity, useOne } from '@refinedev/core';
import { IconButton, Link } from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { File } from '../../types/files';
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
      {
        field: 'action',
        headerName: 'Actions',
        align: 'center',
        renderCell: function render(props) {
          return (
            <>
              <IconButton>
                <Link href={props.row.url} download>
                  <FileDownload />
                </Link>
              </IconButton>
            </>
          );
        },
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
