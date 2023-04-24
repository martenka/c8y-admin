import { Stack } from '@mui/material';
import { Control, TextFieldElement, useFieldArray } from 'react-hook-form-mui';
import React from 'react';
import { TaskPayload } from '../../../types/task';

interface DataUploadTaskFieldsProps {
  control: Control<TaskPayload>;
}

export const DataUploadTaskFields = ({
  control,
}: DataUploadTaskFieldsProps) => {
  const { fields } = useFieldArray<TaskPayload>({
    control,
    name: 'files',
  });

  return (
    <>
      {fields.map((item, index) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            key={`${item.id}`}
            marginBottom={2}
          >
            <TextFieldElement
              name={`files.${index}.id`}
              label={`Local ID`}
              disabled={true}
              sx={{ flex: 1 }}
            />
            <TextFieldElement
              name={`files.${index}.name`}
              label={`File name`}
              disabled={true}
              sx={{ flex: 1 }}
            />
            <TextFieldElement
              name={`files.${index}.visibilityState.exposedToPlatforms`}
              label={`Uploaded to`}
              disabled={true}
              sx={{ flex: 1 }}
            />
          </Stack>
        );
      })}
    </>
  );
};
