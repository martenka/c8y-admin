import { useGetIdentity, useShow } from '@refinedev/core';
import { Show, TextFieldComponent as TextField } from '@refinedev/mui';
import { Typography, Stack } from '@mui/material';
import { Sensor } from '../../types/sensors';
import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { SimpleObject } from '../../components/simpleObject';

export const SensorShow = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const { queryResult } = useShow<Sensor>({
    meta: {
      token,
    },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const customAttributes = record?.customAttributes;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Id
        </Typography>
        <TextField value={record?.id} />
        <Typography variant="body1" fontWeight="bold">
          ManagedObjectId
        </Typography>
        <TextField value={record?.managedObjectId} />
        <Typography variant="body1" fontWeight="bold">
          ManagedObjectName
        </Typography>
        <TextField value={record?.managedObjectName} />
        <Typography variant="body1" fontWeight="bold">
          ValueFragmentType
        </Typography>
        <TextField value={record?.valueFragmentType} />
        <Typography variant="body1" fontWeight="bold">
          ValueFragmentDescription
        </Typography>
        <TextField value={record?.valueFragmentDisplayName} />
        <Typography variant="body1" fontWeight="bold">
          Sensor Description
        </Typography>
        <TextField value={record?.description} />
        {notNil(customAttributes) && (
          <>
            <Typography variant="body1" fontWeight="bold">
              Custom Attributes
            </Typography>
            <SimpleObject value={customAttributes} />
          </>
        )}
      </Stack>
    </Show>
  );
};
