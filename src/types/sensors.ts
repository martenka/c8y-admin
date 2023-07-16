import {
  createPaginatedResponseRuntype,
  CustomAttributesRuntype,
  NonEmptyString,
  StringOrNumber,
  ValueObject,
} from './general';
import { Record, String, Partial as RPartial, Static } from 'runtypes';

export const SensorRuntype = Record({
  id: NonEmptyString,
  managedObjectId: StringOrNumber,
  managedObjectName: String,
  valueFragmentType: String,
})
  .And(
    RPartial({
      valueFragmentDisplayName: String,
      description: String,
      type: String,
    }),
  )
  .And(CustomAttributesRuntype);

export const PaginatedSensorsResponseRuntype =
  createPaginatedResponseRuntype(SensorRuntype);

export type SensorsResponse = Static<typeof PaginatedSensorsResponseRuntype>;
export type Sensor = Static<typeof SensorRuntype>;
export type SensorEditFields = Partial<
  Pick<Sensor, 'valueFragmentDisplayName' | 'description' | 'customAttributes'>
>;
export type SensorEditModeFields =
  | 'DELETE_BY_COMMON'
  | 'COMMON_IDENTIFIERS'
  | 'MANY'
  | 'DELETE_BY_IDS';
export type SensorEditMode<
  T extends SensorEditModeFields = SensorEditModeFields,
> = {
  mode: T;
};

export interface EditMultipleSensorsIdentifiersProperties {
  valueFragmentType?: string;
  sensorIds?: string[];
}

export type RemoveSensorAttributesFields = {
  [P in keyof Pick<
    Sensor,
    'description' | 'customAttributes' | 'valueFragmentDisplayName'
  >]?: boolean;
} & {
  customAttributeKeys: ValueObject<string>[];
};

export interface EditMultipleSensorsIdentifiers {
  identifiers: EditMultipleSensorsIdentifiersProperties;
}

export type EditMultipleSensorsInput = EditMultipleSensorsIdentifiers &
  SensorEditFields &
  SensorEditMode<'COMMON_IDENTIFIERS' | 'MANY'>;

export type RemoveSensorsAttributesInput = EditMultipleSensorsIdentifiers &
  RemoveSensorAttributesFields &
  SensorEditMode<'DELETE_BY_COMMON' | 'DELETE_BY_IDS'>;

export type EditMultipleSensors =
  | EditMultipleSensorsInput
  | RemoveSensorsAttributesInput;

export type EditMultipleSensorsAPIInput = Omit<
  EditMultipleSensorsInput,
  'mode'
>;

export type RemoveSensorsAttributesAPIInput = Omit<
  RemoveSensorsAttributesInput,
  'customAttributeKeys' | 'mode'
> & { customAttributeKeys: string[] };

export type EditSensorsByCommonIdentifiersAPIInput =
  | EditMultipleSensorsAPIInput
  | RemoveSensorsAttributesAPIInput
  | Partial<Sensor>[];
