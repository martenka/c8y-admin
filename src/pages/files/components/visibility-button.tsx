import { LoadingButton } from '@mui/lab';
import {
  FileVisibilityState,
  VisibilityStateValues,
} from '../../../types/files';
import React from 'react';
import { useCreate } from '@refinedev/core';

interface FileVisibilityButtonProps {
  visibilityState?: FileVisibilityState;
  fileId: string;
  token: string | undefined;
}

export const FileVisibilityButton = ({
  visibilityState,
  fileId,
  token,
}: FileVisibilityButtonProps) => {
  const { mutate } = useCreate({
    mutationOptions: { retry: false },
  });
  const fileVisibility = visibilityState ?? {
    stateChanging: false,
    published: false,
  };
  return (
    <>
      <LoadingButton
        variant="contained"
        disabled={fileVisibility.stateChanging}
        loading={fileVisibility.stateChanging}
        sx={{
          color: 'black',
          backgroundColor: fileVisibility.published ? '#adebad' : '#ff9999',
        }}
        onClick={() => {
          if (!fileVisibility.stateChanging) {
            mutate({
              successNotification: {
                type: 'success',
                message: 'Successfully started visibility state change',
              },
              errorNotification: (props) => {
                return {
                  type: 'error',
                  message: `${props?.message} - ${props?.statusCode}`,
                };
              },
              meta: {
                token,
                additionalPath: `${fileId}/visibility-state`,
              },
              resource: 'files',
              values: {
                newVisibilityState: fileVisibility.published
                  ? VisibilityStateValues.PRIVATE
                  : VisibilityStateValues.PUBLIC,
              },
            });
            fileVisibility.stateChanging = true;
          }
        }}
      >
        <span>{fileVisibility.published ? 'PUBLIC' : 'PRIVATE'}</span>
      </LoadingButton>
    </>
  );
};
