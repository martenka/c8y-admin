import { Stack } from '@mui/material';
import { Control, TextFieldElement } from 'react-hook-form-mui';
import React from 'react';
import { TaskPayload } from '../../../types/tasks/task';

interface ObjectSyncTaskProps {
  control: Control<TaskPayload>;
}
export const ObjectSyncTaskFields = (_props: ObjectSyncTaskProps) => {
  return (
    <>
      <Stack direction="column" spacing={2}>
        <TextFieldElement
          name="groupTypeIdentifier"
          label="Group fragment identifier"
        />
      </Stack>
    </>
  );
};
