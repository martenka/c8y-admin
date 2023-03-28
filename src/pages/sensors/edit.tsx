import React from 'react';
import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useGetIdentity } from '@refinedev/core';
import { UserIdentity } from '../../types/auth';
import { notNil } from '../../utils/validators';
import { Sensor } from '../../types/sensors';
import { SimpleEditableObject } from '../../components/simpleEditableObject';

export const SensorEdit = () => {
  const auth = useGetIdentity<UserIdentity>();
  const token = notNil(auth.data) ? auth.data?.token : undefined;

  const form = useForm<Sensor>({
    refineCoreProps: { meta: { token } },
  });

  const data = form?.refineCore?.queryResult?.data?.data;

  return (
    <Edit
      isLoading={form.refineCore.formLoading}
      saveButtonProps={form.saveButtonProps}
    >
      <FormContainer
        formContext={{ ...form }}
        defaultValues={{
          id: '',
          managedObjectId: '',
          managedObjectName: '',
          valueFragmentType: '',
          valueFragmentDisplayName: '',
          description: '',
          customAttributes: {},
        }}
        onSuccess={console.log}
      >
        <TextFieldElement
          sx={{ color: 'black !important' }}
          margin="normal"
          fullWidth
          name="id"
          label="ID"
          disabled={true}
        />
        <TextFieldElement
          margin="normal"
          fullWidth
          name="managedObjectId"
          label="ManagedObjectId"
          disabled={true}
        />
        <TextFieldElement
          margin="normal"
          fullWidth
          name="managedObjectName"
          label="ManagedObjectName"
          disabled={true}
        />
        <TextFieldElement
          margin="normal"
          fullWidth
          name="valueFragmentType"
          label="FragmentType"
          disabled={true}
        />
        <TextFieldElement
          margin="normal"
          fullWidth
          name="valueFragmentDisplayName"
          label="ValueFragmentDescription"
        />
        <TextFieldElement
          margin="normal"
          fullWidth
          name="description"
          label="Description"
        />
        <SimpleEditableObject
          form={form}
          valueName={'customAttributes'}
          value={data?.customAttributes}
        />
      </FormContainer>
    </Edit>
  );
};
