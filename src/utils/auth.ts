export function getAuthHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
