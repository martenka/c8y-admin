import { Array, Record, Static } from 'runtypes';
import { NonEmptyString } from './general';

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

export interface UserToken extends AuthPermissions {
  id: string;
  name: string;
  token: string;
  avatar?: string;
}

export type UserIdentity = UserToken | null;
