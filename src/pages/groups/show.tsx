import { useGetIdentity, useShow } from '@refinedev/core';
import { Show, ShowButton } from '@refinedev/mui';
import { Typography, Stack, Grid, Button } from '@mui/material';
import { UserIdentity } from '../../types/auth';
import { isNil, notNil } from '../../utils/validators';
import { Group } from '../../types/group';
import { DataGrid, GridColumns } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { Sensor } from '../../types/sensors';
import { CustomAttributes } from '../../components/CustomAttributes';
import { useNavigate } from 'react-router-dom';

export const GroupShow = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = auth.data?.token;
  const isAdmin = auth.data?.isAdmin;
  const navigate = useNavigate();

  const [listSelection, setListSelection] = useState<Sensor[]>([]);
  const [gridColumnAmount, setGridColumnAmount] = useState({
    left: 0,
    right: 12,
  });
  const { queryResult } = useShow<Group>({
    meta: {
      token,
    },
  });
  const { data, isLoading } = queryResult;

  const groupData = data?.data;

  const customAttributes = groupData?.customAttributes;

  React.useMemo(() => {
    const gridColumnValues = isNil(customAttributes)
      ? { left: 0, right: 12 }
      : { left: 2, right: 10 };
    setGridColumnAmount(gridColumnValues);
  }, [customAttributes]);
  const columns = React.useMemo<GridColumns<Sensor>>(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'managedObjectId', headerName: 'ManagedObject', flex: 1 },
      { field: 'managedObjectName', headerName: 'ManagedObjectName', flex: 1 },
      { field: 'valueFragmentType', headerName: 'FragmentType', flex: 1 },
      {
        field: 'valueFragmentDisplayName',
        headerName: 'FragmentIdentifier',
        flex: 1,
      },
      {
        field: 'action',
        headerName: 'Actions',
        renderCell: function render({ row }) {
          return (
            <>
              <ShowButton hideText recordItemId={row.id} resource="sensors" />
            </>
          );
        },
        flex: 1,
      },
    ],
    [],
  );

  const rows = groupData?.sensors ?? [];

  return (
    <Show
      isLoading={isLoading}
      contentProps={{ sx: { height: '100%' } }}
      wrapperProps={{ sx: { height: '100%' } }}
      headerButtons={({ defaultButtons }) => {
        return (
          <>
            {defaultButtons}
            {isAdmin && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/tasks/create', {
                    state: { taskType: 'DATA_FETCH', sensors: listSelection },
                  });
                }}
              >
                Fetch sensor data
              </Button>
            )}
          </>
        );
      }}
    >
      <Stack gap={1} height="100%">
        <Stack direction="row" gap={1}>
          <Typography variant="body1" flex={1}>
            ID
          </Typography>
          <Typography variant="body1" fontWeight="bold" flex={11}>
            {groupData?.id}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <Typography variant="body1" flex={1}>
            Group name
          </Typography>
          <Typography variant="body1" fontWeight="bold" flex={11} align="left">
            {groupData?.name}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <Typography variant="body1" flex={1}>
            Description
          </Typography>
          <Typography variant="body1" fontWeight="bold" flex={11} align="left">
            {groupData?.description}
          </Typography>
        </Stack>
        <Grid container sx={{ height: '100%' }}>
          {notNil(customAttributes) && (
            <Grid item xs={12} lg={gridColumnAmount.left} marginTop={2}>
              <CustomAttributes value={customAttributes} />
            </Grid>
          )}
          <Grid
            item
            xs={12}
            lg={gridColumnAmount.right}
            sx={{ height: '100%', mt: 2 }}
          >
            <DataGrid
              columns={columns}
              rows={rows}
              checkboxSelection
              onSelectionModelChange={(model) => {
                const selectedIds = new Set(model);
                const selectedSensors = rows.filter((item) =>
                  selectedIds.has(item.id),
                );
                setListSelection(selectedSensors ?? []);
              }}
              autoHeight
            />
          </Grid>
        </Grid>
      </Stack>
    </Show>
  );
};
