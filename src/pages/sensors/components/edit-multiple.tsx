import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CheckboxElement,
  FormContainer,
  TextFieldElement,
  UseFormReturn,
  useForm,
} from 'react-hook-form-mui';
import {
  EditMultipleSensors,
  EditMultipleSensorsInput,
  EditSensorsByCommonIdentifiersAPIInput,
  RemoveSensorsAttributesInput,
  Sensor,
  SensorEditMode,
  SensorEditModeFields,
} from '../../../types/sensors';
import { ApiResponseError } from '../../../utils/error';
import { useCustomMutation, useInvalidate } from '@refinedev/core';
import { SimpleFormObject } from '../../../components/simpleFormObject';
import { forwardRef, useEffect } from 'react';
import { SimpleFormArray } from '../../../components/simpleFormArray';
import {
  removeNilAndEmptyProperties,
  valueObjectArrayToBasicArray,
} from '../../../utils/helpers';
import { ShowButton } from '@refinedev/mui';

export interface EditMultipleSensorsProps {
  authToken?: string;
  sensors: Sensor[];
  deleteAttributes?: boolean;
  close: () => void;
}

type SensorEditForm<T extends EditMultipleSensors = EditMultipleSensors> = {
  form: UseFormReturn<T, ApiResponseError>;
};

function editSensorsAttributesGuard(
  value: EditMultipleSensors,
): value is EditMultipleSensorsInput {
  return value.mode === 'COMMON_IDENTIFIERS' || value.mode === 'MANY';
}

function removeSensorsAttributesGuard(
  value: EditMultipleSensors,
): value is RemoveSensorsAttributesInput {
  return value.mode === 'DELETE_BY_COMMON' || value.mode === 'DELETE_BY_IDS';
}

export const EditMultipleSensorsModal = forwardRef(
  (props: EditMultipleSensorsProps, _ref) => {
    let mode: SensorEditModeFields | undefined = undefined;

    if (props.deleteAttributes && props.sensors.length === 0) {
      mode = 'DELETE_BY_COMMON';
    } else if (props.deleteAttributes && props.sensors.length !== 0) {
      mode = 'DELETE_BY_IDS';
    } else if (!props.deleteAttributes && props.sensors.length === 0) {
      mode = 'COMMON_IDENTIFIERS';
    } else if (!props.deleteAttributes && props.sensors.length !== 0) {
      mode = 'MANY';
    }

    const form = useForm<EditMultipleSensors, ApiResponseError>();

    const invalidate = useInvalidate();

    const { mutateAsync: sensorsEditAction } = useCustomMutation();

    return (
      <Box sx={{ maxHeight: '90vh', overflow: 'auto' }}>
        <FormContainer formContext={{ ...form }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{
              backgroundColor: 'white',
              padding: '2em',
              minWidth: '600px',
            }}
          >
            <EditMultipleSensorsSwitcher {...props} form={form} mode={mode} />
            <Button
              variant="contained"
              onClick={form.handleSubmit(async (formValues) => {
                props?.close();
                let apiInput:
                  | Partial<EditSensorsByCommonIdentifiersAPIInput>
                  | undefined = undefined;
                let url: string | undefined = undefined;
                let method: 'post' | 'patch' = 'patch';
                if (removeSensorsAttributesGuard(formValues)) {
                  const convertedKeys = valueObjectArrayToBasicArray(
                    formValues.customAttributeKeys,
                  );

                  apiInput = removeNilAndEmptyProperties({
                    customAttributes: formValues.customAttributes,
                    description: formValues.description,
                    valueFragmentDisplayName:
                      formValues.valueFragmentDisplayName,
                    customAttributeKeys: convertedKeys,
                  });

                  if (formValues.mode === 'DELETE_BY_COMMON') {
                    apiInput.identifiers = {
                      valueFragmentType:
                        formValues.identifiers.valueFragmentType,
                    };
                  } else {
                    apiInput.identifiers = {
                      sensorIds: props.sensors.map((sensor) => sensor.id),
                    };
                  }
                  url = 'sensors/attributes/delete';
                  method = 'post';
                } else if (editSensorsAttributesGuard(formValues)) {
                  url = 'sensors/attributes';
                  method = 'patch';

                  apiInput = removeNilAndEmptyProperties({
                    description: formValues.description,
                    valueFragmentDisplayName:
                      formValues.valueFragmentDisplayName,
                    customAttributes: formValues.customAttributes,
                  });

                  if (formValues.mode === 'MANY') {
                    apiInput.identifiers = {
                      sensorIds: props.sensors.map((sensor) => sensor.id),
                    };
                  } else {
                    apiInput.identifiers = {
                      valueFragmentType:
                        formValues.identifiers.valueFragmentType,
                    };
                  }
                }

                if (apiInput != undefined && url != undefined) {
                  await sensorsEditAction({
                    method,
                    url,
                    values: apiInput,
                    meta: { token: props.authToken },
                    successNotification: {
                      message: 'Sensors edited',
                      type: 'success',
                    },
                  });
                  invalidate({
                    resource: 'sensors',
                    invalidates: ['resourceAll'],
                  });
                }
              })}
            >
              Save
            </Button>
          </Stack>
        </FormContainer>
      </Box>
    );
  },
);

export const EditMultipleSensorsSwitcher = (
  props: EditMultipleSensorsProps & Partial<SensorEditMode> & SensorEditForm,
) => {
  switch (props.mode) {
    case 'COMMON_IDENTIFIERS':
      return (
        <EditMultipleSensorsByCommonIdentifiersContent
          form={
            props.form as UseFormReturn<
              EditMultipleSensorsInput,
              ApiResponseError
            >
          }
        />
      );
    case 'DELETE_BY_COMMON':
      return (
        <DeleteSensorAttributesByCommonIdentifiersContent
          form={
            props.form as UseFormReturn<
              RemoveSensorsAttributesInput,
              ApiResponseError
            >
          }
        />
      );
    case 'DELETE_BY_IDS':
      return (
        <DeleteSensorAttributesBySensorIdsContent
          form={
            props.form as UseFormReturn<
              RemoveSensorsAttributesInput,
              ApiResponseError
            >
          }
          sensors={props.sensors}
          authToken={props.authToken}
        />
      );
    case 'MANY':
      return (
        <EditMultipleSensorsBySensorIdsContent
          form={
            props.form as UseFormReturn<
              EditMultipleSensorsInput,
              ApiResponseError
            >
          }
          sensors={props.sensors}
          authToken={props.authToken}
        />
      );
    default:
      return <p>Unknown Edit Mode</p>;
  }
};

const EditMultipleSensorsByCommonIdentifiersContent = (
  props: SensorEditForm<EditMultipleSensorsInput>,
) => {
  useEffect(() => props.form.setValue('mode', 'COMMON_IDENTIFIERS'), []);
  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Identifiers" />
        <CardContent>
          <TextFieldElement
            fullWidth
            required
            name="identifiers.valueFragmentType"
            label="ValueFragmentType"
          />
        </CardContent>
      </Card>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Update" />
        <CardContent>
          <Stack gap={1}>
            <TextFieldElement
              fullWidth
              name="description"
              label="Description"
            />
            <TextFieldElement
              fullWidth
              name="valueFragmentDisplayName"
              label="Fragment Description"
            />
            <SimpleFormObject
              form={props.form}
              objectDisplayName="Custom Attributes"
              objectName="customAttributes"
              value={props.form.getValues().customAttributes}
              sx={{ maxHeight: '30vh', overflow: 'auto' }}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

const DeleteSensorAttributesByCommonIdentifiersContent = (
  props: SensorEditForm<RemoveSensorsAttributesInput>,
) => {
  useEffect(() => props.form.setValue('mode', 'DELETE_BY_COMMON'), []);
  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Identifiers" />
        <CardContent>
          <TextFieldElement
            fullWidth
            required
            name="identifiers.valueFragmentType"
            label="ValueFragmentType"
          />
        </CardContent>
      </Card>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Deletion" />
        <CardContent>
          <Stack gap={1}>
            <CheckboxElement name="description" label="Description" />
            <CheckboxElement
              name="valueFragmentDisplayName"
              label="ValueFragmentDescription"
            />
            <CheckboxElement
              name="customAttributes"
              label="Custom Attributes"
            />
            <SimpleFormArray
              form={props.form}
              objectName="customAttributeKeys"
              objectDisplayName="Sensor custom attributes keys to remove"
              boldObjectDisplayName={true}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

const DeleteSensorAttributesBySensorIdsContent = (
  props: Pick<EditMultipleSensorsProps, 'sensors' | 'authToken'> &
    SensorEditForm<RemoveSensorsAttributesInput>,
) => {
  useEffect(() => props.form.setValue('mode', 'DELETE_BY_IDS'), []);
  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Identifiers" />
        <CardContent>
          <TableContainer sx={{ overflow: 'auto', maxHeight: '30vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell key="sensor">Sensor ID</TableCell>
                  <TableCell key="name">Managed Object Name</TableCell>
                  <TableCell key="bucket">Managed Object ID</TableCell>
                  <TableCell key="path">Value Fragment Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.sensors.map((sensor) => {
                  const rowId = sensor.id;
                  return (
                    <TableRow key={`sensor.${rowId}`}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {rowId}
                          {
                            <ShowButton
                              hideText
                              recordItemId={rowId}
                              resource="sensors"
                              meta={{ token: props.authToken }}
                            />
                          }
                        </Stack>
                      </TableCell>
                      <TableCell>{sensor.managedObjectName}</TableCell>
                      <TableCell>{sensor.managedObjectId}</TableCell>
                      <TableCell>{sensor.valueFragmentType}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Deletion" />
        <CardContent>
          <Stack gap={1}>
            <CheckboxElement name="description" label="Description" />
            <CheckboxElement
              name="valueFragmentDisplayName"
              label="ValueFragmentDescription"
            />
            <CheckboxElement
              name="customAttributes"
              label="Custom Attributes"
            />
            <SimpleFormArray
              form={props.form}
              objectName="customAttributeKeys"
              objectDisplayName="Sensor custom attributes keys to remove"
              boldObjectDisplayName={true}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

const EditMultipleSensorsBySensorIdsContent = (
  props: Pick<EditMultipleSensorsProps, 'sensors' | 'authToken'> &
    SensorEditForm<EditMultipleSensorsInput>,
) => {
  useEffect(() => props.form.setValue('mode', 'MANY'), []);
  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Identifiers" />
        <CardContent>
          <TableContainer sx={{ overflow: 'auto', maxHeight: '30vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell key="sensor">Sensor ID</TableCell>
                  <TableCell key="name">Managed Object Name</TableCell>
                  <TableCell key="bucket">Managed Object ID</TableCell>
                  <TableCell key="path">Value Fragment Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.sensors.map((sensor) => {
                  const rowId = sensor.id;
                  return (
                    <TableRow key={`sensor.${rowId}`}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {rowId}
                          {
                            <ShowButton
                              hideText
                              recordItemId={rowId}
                              resource="sensors"
                              meta={{ token: props.authToken }}
                            />
                          }
                        </Stack>
                      </TableCell>
                      <TableCell>{sensor.managedObjectName}</TableCell>
                      <TableCell>{sensor.managedObjectId}</TableCell>
                      <TableCell>{sensor.valueFragmentType}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Update" />
        <CardContent>
          <Stack gap={1}>
            <TextFieldElement
              fullWidth
              name="description"
              label="Description"
            />
            <TextFieldElement
              fullWidth
              name="valueFragmentDisplayName"
              label="Fragment Description"
            />
            <SimpleFormObject
              form={props.form}
              objectDisplayName="Custom Attributes"
              objectName="customAttributes"
              value={props.form.getValues().customAttributes}
              sx={{ maxHeight: '30vh', overflow: 'auto' }}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
