export function getEnumKeyName(value: string, enumObject: any) {
  return Object.entries(enumObject).find(([_key, val]) => val === value)?.[0];
}
