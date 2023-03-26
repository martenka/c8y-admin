import { AuthBindings } from '@refinedev/core';
import { isNil, notNil } from '../utils/validators';
import {
  AuthPermissions,
  DefaultAuthPayload,
  JwtAuthPayloadRuntype,
  JwtAuthResponseRuntype,
  UserIdentity,
} from '../types/auth';
import {
  AuthActionResponse,
  CheckResponse,
  OnErrorResponse,
} from '@refinedev/core/dist/interfaces';
import jwtDecode, { InvalidTokenError } from 'jwt-decode';

export const AUTH_TOKEN = 'auth';

export function hasAdminRole(roles?: string[]): boolean {
  if (isNil(roles)) {
    return false;
  }

  return roles.includes('Admin');
}

export const authProvider: AuthBindings = {
  login: async ({ username, password }): Promise<AuthActionResponse> => {
    if (notNil(username) && notNil(password)) {
      const url = new URL('/v1/auth/login', process.env.REACT_APP_DOMAIN);

      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const responseBody = await response.json();

      if (JwtAuthResponseRuntype.guard(responseBody)) {
        localStorage.setItem(AUTH_TOKEN, responseBody.access_token);
        try {
          JwtAuthPayloadRuntype.check(jwtDecode(responseBody.access_token));
        } catch (e) {
          if (e instanceof InvalidTokenError) {
            throw new Error('Invalid auth token from backend');
          }
          throw e;
        }

        return {
          success: true,
          redirectTo: '/',
        };
      }
    }

    return {
      success: false,
      error: {
        name: 'LoginError',
        message: 'Invalid username or password',
      },
    };
  },
  logout: async (): Promise<AuthActionResponse> => {
    localStorage.removeItem(AUTH_TOKEN);
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  check: async (): Promise<CheckResponse> => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: '/login',
    };
  },
  getPermissions: async (): Promise<AuthPermissions> => {
    const token = localStorage.getItem(AUTH_TOKEN);
    let isAdmin = false;
    if (token) {
      const tokenPayload = jwtDecode<DefaultAuthPayload>(token);
      isAdmin = hasAdminRole(tokenPayload.roles);
    }

    return { isAdmin };
  },
  getIdentity: async (): Promise<UserIdentity> => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      const tokenPayload = jwtDecode<DefaultAuthPayload>(token);
      return {
        id: tokenPayload.sub,
        name: tokenPayload.usr,
        token,
        avatar: 'https://i.pravatar.cc/300',
      };
    }
    return null;
  },
  onError: async (error): Promise<OnErrorResponse> => {
    if ([401, 403].includes(error?.status)) {
      return { error, redirectTo: '/v1/auth/login', logout: true };
    }
    return { error };
  },
};
