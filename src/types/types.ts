import { Record, Static, String, Array } from 'runtypes';

export const NonEmptyString = String.withConstraint(
  (value) => value.length !== 0,
);

export const UsernameAndPasswordRuntype = Record({
  username: NonEmptyString,
  password: NonEmptyString,
});

export const JwtAuthResponseRuntype = Record({
  access_token: NonEmptyString,
});

export const JwtAuthPayloadRuntype = Record({
  roles: Array(NonEmptyString),
  usr: NonEmptyString,
  sub: NonEmptyString,
});

export type DefaultLoginCredentials = Static<typeof UsernameAndPasswordRuntype>;
export type DefaultAuthResponse = Static<typeof JwtAuthResponseRuntype>;
export type DefaultAuthPayload = Static<typeof JwtAuthPayloadRuntype>;

export type AuthPermissions = {
  isAdmin: boolean;
};

export interface User {
  id: string;
  name: string;
  avatar?: string;
}
