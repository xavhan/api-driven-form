/// <reference types="svelte" />

type Brand<T, B> = T & { __brand: B };

type FieldId = string; // Brand<"string", "FieldId">;
type FieldType = "string" | "number";

type Field = {
  type: FieldType;
  label?: string;
  description?: string;
  enum?: (string | number)[];
  enumNames?: string[];
};

type NaiveFormSchema = {
  title?: string;
  properties: Record<FieldId, Field>;
  required?: FieldId[];
};

type NaiveUISchema = any & // to fix
  Record<FieldId, UIModifier> &
  Partial<{
    "ui:order"?: FieldId[];
  }>;
type UIModifier = Partial<{
  classNames: string;
}>;

type Value = string | number;
type NaiveFormData = Record<FieldId, Value>;
