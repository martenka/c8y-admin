import React from 'react';
import { useResource, useDeleteMany } from '@refinedev/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { DeleteButtonProps } from '@refinedev/mui';
import { notNil } from '../utils/validators';
import { DeleteOutline } from '@mui/icons-material';

type DeleteManyButtonProps = Pick<
  DeleteButtonProps,
  'meta' | 'disabled' | 'sx'
> & {
  ids: string[];
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
      <IconButton onClick={handleDialogOpen} {...rest}>
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
