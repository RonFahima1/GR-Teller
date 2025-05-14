import { NewClientFormData } from '../types/form';

type NestedPath<T> = {
  [K in keyof T]: T[K] extends object
    ? K | `${K}.${NestedPath<T[K]>}`
    : K;
}[keyof T];

export type FormPath = NestedPath<NewClientFormData>;

export function getFormPath(path: string): path is FormPath {
  return true; // TypeScript utility type, always returns true
}

export function getFormValue<T extends NewClientFormData>(
  form: { getValues: (path: string) => any },
  path: string
): T[keyof T] | undefined {
  return form.getValues(path);
}

export function setFormValue<T extends NewClientFormData>(
  form: { setValue: (path: string, value: any) => void },
  path: string,
  value: any
): void {
  form.setValue(path, value);
}
