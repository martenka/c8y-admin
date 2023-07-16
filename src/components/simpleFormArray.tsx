import { Theme } from '@emotion/react';
import { ResponsiveStyleValue } from '@mui/system';
import { SxProps, Typography, Stack, TextField, Button } from '@mui/material';

import {
  FieldValues,
  UseFormReturn,
  useFieldArray,
  ArrayPath,
  FieldArray,
  Controller,
  Path,
} from 'react-hook-form';
import { notNil } from '../utils/validators';

/**
 * Appends values in form {value: string}
 */
export function SimpleFormArray<TFields extends FieldValues, TContext>(props: {
  objectName: keyof TFields & string;
  objectDisplayName: string;
  boldObjectDisplayName?: boolean;
  form: UseFormReturn<TFields, TContext>;
  direction?: ResponsiveStyleValue<
    'row' | 'row-reverse' | 'column' | 'column-reverse'
  >;
  spacing?: ResponsiveStyleValue<number | string>;
  divider?: React.ReactNode;
  sx?: SxProps<Theme>;
}): JSX.Element {
  const { append, fields, remove } = useFieldArray({
    control: props.form.control,
    name: props.objectName as ArrayPath<TFields>,
  });

  return (
    <>
      <Typography
        variant="body1"
        fontWeight={props.boldObjectDisplayName ? 'bold' : 'normal'}
      >
        {props.objectDisplayName}
      </Typography>
      <Stack
        direction={props.direction ?? 'column'}
        spacing={props.spacing ?? 1}
        sx={{
          ...(props?.sx ?? {}),
          mt: 2,
          overflow: 'auto',
          maxHeight: '40vh',
        }}
        divider={props.divider}
      >
        {fields.map((field, index) => {
          return (
            <Stack
              direction="row"
              spacing={1}
              key={`${props.objectName}.${field.id}.row`}
            >
              <Controller
                rules={{
                  required: 'This field is required',
                }}
                control={props.form.control}
                key={`${props.objectName}.${field.id}.value`}
                name={`${props.objectName}.${index}.value` as Path<TFields>}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    error={notNil(fieldState.error)}
                    helperText={fieldState.error?.message}
                    label={`Key`}
                  />
                )}
              />
              <Button
                onClick={() => {
                  remove(index);
                }}
              >
                Delete
              </Button>
            </Stack>
          );
        })}
      </Stack>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={() => {
          append({ value: '' } as FieldArray<TFields, ArrayPath<TFields>>);
        }}
        sx={{ mt: 1 }}
      >
        Add
      </Button>
    </>
  );
}
