import { Button, Stack, TextField, Typography } from '@mui/material';

import React, { useState } from 'react';
import { ResponsiveStyleValue, SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles/createTheme';
import { getKeyValuePair, objectToKeyValues } from '../utils/transforms';
import { ManyKeyValues } from '../types/general';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

export const updateFormStateFromObject = <
  TFields extends FieldValues,
  TContext,
>(
  attributeName: keyof TFields,
  attributeValues: ManyKeyValues,
  form: UseFormReturn<TFields, TContext>,
) => {
  const levelObject: Record<string, string> = {};

  Object.keys(attributeValues).forEach((key) => {
    levelObject[attributeValues[key].key] = attributeValues[key].value;
  });

  form.setValue(
    attributeName as Path<TFields>,
    levelObject as PathValue<TFields, Path<TFields>>,
    {
      shouldValidate: true,
    },
  );
};

export function SimpleFormObject<TFields extends FieldValues, TContext>(props: {
  objectName: keyof TFields & string;
  objectDisplayName: string;
  form: UseFormReturn<TFields, TContext>;
  value: Record<string | number, string> | undefined;
  direction?: ResponsiveStyleValue<
    'row' | 'row-reverse' | 'column' | 'column-reverse'
  >;
  spacing?: ResponsiveStyleValue<number | string>;
  divider?: React.ReactNode;
  sx?: SxProps<Theme>;
}): JSX.Element {
  const [attributes, setAttributes] = useState(
    objectToKeyValues(props?.value ?? {}),
  );

  return (
    <>
      <Typography variant="body1" fontWeight="bold">
        {props.objectDisplayName}
      </Typography>
      <Stack
        direction={props.direction ?? 'column'}
        spacing={props.spacing ?? 1}
        sx={{
          mt: 2,
          ...(props?.sx ?? {}),
        }}
        divider={props.divider}
      >
        {Object.keys(attributes).map((key) => {
          return (
            <Stack
              direction="row"
              spacing={1}
              key={`${props.objectName}.${key}`}
            >
              <TextField
                required
                fullWidth
                key={`${key}.key`}
                label={'key'}
                defaultValue={attributes[key].key}
                onChange={(e) => {
                  setAttributes((prevState) => {
                    const newState = { ...prevState };
                    newState[key].key = e.target.value;
                    updateFormStateFromObject(
                      props.objectName,
                      attributes,
                      props.form,
                    );
                    return newState;
                  });
                }}
              />
              <TextField
                fullWidth
                key={`${key}.value`}
                label={'value'}
                defaultValue={attributes[key].value}
                onChange={(e) => {
                  setAttributes((prevState) => {
                    const newState = { ...prevState };
                    newState[key].value = e.target.value;
                    updateFormStateFromObject(
                      props.objectName,
                      attributes,
                      props.form,
                    );
                    return newState;
                  });
                }}
              />
              <Button
                onClick={() => {
                  setAttributes((prevState) => {
                    const newState = { ...prevState };
                    delete newState[key];
                    updateFormStateFromObject(
                      props.objectName,
                      newState,
                      props.form,
                    );
                    return newState;
                  });
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
          setAttributes((prevState) => {
            const newState = { ...prevState };
            const keyValuePair = getKeyValuePair();

            Object.keys(keyValuePair).forEach(
              (key) => (newState[key] = keyValuePair[key]),
            );

            return newState;
          });
        }}
        sx={{ mt: 1 }}
      >
        Add
      </Button>
    </>
  );
}
