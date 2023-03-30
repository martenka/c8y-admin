import { Button, Stack, TextField, Typography } from '@mui/material';

import React, { useState } from 'react';
import { ResponsiveStyleValue, SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles/createTheme';
import { UseFormReturnType } from '@refinedev/react-hook-form';
import { getKeyValuePair, objectToKeyValues } from '../utils/transforms';
import { ManyKeyValues } from '../types/general';

export const updateFormStateFromObject = (
  attributeName: string,
  attributeValues: ManyKeyValues,
  form: UseFormReturnType,
) => {
  const levelObject: Record<string, string> = {};

  Object.keys(attributeValues).forEach((key) => {
    levelObject[attributeValues[key].key] = attributeValues[key].value;
  });

  form.setValue(attributeName, levelObject, { shouldValidate: true });
};

export const SimpleFormObject = (props: {
  objectName: string;
  objectDisplayName: string;
  form: UseFormReturnType;
  value: Record<string | number, string> | undefined;
  direction?: ResponsiveStyleValue<
    'row' | 'row-reverse' | 'column' | 'column-reverse'
  >;
  spacing?: ResponsiveStyleValue<number | string>;
  divider?: React.ReactNode;
  sx?: SxProps<Theme>;
}): JSX.Element => {
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
        sx={{ ...(props?.sx ?? {}), mt: 2 }}
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
        <Button
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
        >
          Add
        </Button>
      </Stack>
    </>
  );
};
