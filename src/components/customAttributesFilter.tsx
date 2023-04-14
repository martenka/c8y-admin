import { Button, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, useFieldArray } from 'react-hook-form-mui';
import React from 'react';
import { CustomAndUnknownFilterVariables } from '../types/filters';

export interface CustomAttributesFilterProps {
  control: Control<CustomAndUnknownFilterVariables>;
}
export const CustomAttributesFilter = ({
  control,
}: CustomAttributesFilterProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray<
    CustomAndUnknownFilterVariables,
    'customAttributes'
  >({
    control,
    name: 'customAttributes',
  });

  return (
    <Stack>
      <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
        Custom Attributes
      </Typography>
      {fields.map((field, index) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            key={`${field.id}`}
            marginBottom={2}
          >
            <Controller
              control={control}
              key={`customAttributes.${index}.key`}
              name={`customAttributes.${index}.key`}
              render={({ field }) => (
                <TextField {...field} required fullWidth label={`Key`} />
              )}
            />
            <Controller
              key={`customAttributes.${index}.value`}
              control={control}
              name={`customAttributes.${index}.value`}
              render={({ field }) => (
                <TextField {...field} required fullWidth label={`Value`} />
              )}
            />
            <Button
              onClick={() => {
                remove(index);
              }}
            >
              Remove
            </Button>
          </Stack>
        );
      })}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        fullWidth
        onClick={() => append({ key: '', value: '' })}
      >
        Add attribute
      </Button>
    </Stack>
  );
};
