export function notNil<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isNil<T>(
  value: T,
): value is T extends null | undefined ? T : never {
  return !notNil(value);
}
