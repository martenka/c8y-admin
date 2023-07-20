import React from 'react';
import { useResource, useDeleteMany } from '@refinedev/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Theme,
} from '@mui/material';
import { DeleteButtonProps } from '@refinedev/mui';
import { notNil } from '../utils/validators';
import { DeleteOutline } from '@mui/icons-material';
import { SxProps } from '@mui/system';

type DeleteManyButtonProps = Pick<DeleteButtonProps, 'meta' | 'disabled'> & {
  ids: string[];
  sx?: SxProps<Theme>;
};
export const DeleteManyButton = ({
  ids,
  meta,
  ...rest
}: DeleteManyButtonProps): JSX.Element => {
  const { resource } = useResource();
  const resourceName = resource?.name;

  const { mutate } = useDeleteMany({ mutationOptions: { meta } });
  const [open, setOpen] = React.useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleCloseOnConfirm = () => {
    setOpen(false);
    if (notNil(resourceName)) {
      mutate({
        meta: meta,
        ids,
        resource: resourceName,
      });
    }
  };

  return (
    <div>
      <IconButton
        onClick={handleDialogOpen}
        sx={rest.sx}
        disabled={rest.disabled}
      >
        <DeleteOutline />
      </IconButton>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button color="error" onClick={handleCloseOnConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
