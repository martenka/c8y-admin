import { Stack, Typography } from '@mui/material';
import {
  Control,
  DateTimePickerElement,
  TextFieldElement,
  useFieldArray,
} from 'react-hook-form-mui';
import React from 'react';
import { TaskPayload } from '../../types/task';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface DataFetchTaskProps {
  control: Control<TaskPayload>;
}
export const DataFetchTaskFields = ({ control }: DataFetchTaskProps) => {
  const { fields } = useFieldArray<TaskPayload>({
    control,
    name: 'sensors',
  });
  return (
    <>
      <Typography variant="body1" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
        Fetch timeframe
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
        <Stack direction={'row'} spacing={2}>
          <DateTimePickerElement
            name={'dateFrom'}
            label="Date From"
            format={'DD/MM/YYYY HH'}
            sx={{ flex: 1 }}
          />
          <DateTimePickerElement
            name={'dateTo'}
            label="Date To"
            format={'DD/MM/YYYY HH'}
            sx={{ flex: 1 }}
          />
        </Stack>
      </LocalizationProvider>
      <Typography variant="body1" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
        Payload sensors
      </Typography>
      {fields.map((item, index) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            key={`${item.id}`}
            marginBottom={2}
          >
            <TextFieldElement
              name={`sensors.${index}.id`}
              label={`Id`}
              disabled={true}
              sx={{ flex: 1 }}
            />
            <TextFieldElement
              name={`sensors.${index}.managedObjectId`}
              label={`ManagedObjectId`}
              disabled={true}
              sx={{ flex: 1 }}
            />
            <TextFieldElement
              name={`sensors.${index}.valueFragmentType`}
              label={`FragmentType`}
              disabled={true}
              sx={{ flex: 1.5 }}
            />
            <TextFieldElement
              name={`sensors.${index}.fileName`}
              label={`Filename`}
              sx={{ flex: 2 }}
            />
          </Stack>
        );
      })}
    </>
  );
};
