// filepath: src/schemas/validation.ts
export const validateField = (
  value: string,
  rules: {
    required?: string;
    pattern?: { value: RegExp; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
  },
): string | null => {
  if (rules.required && !value) {
    return rules.required;
  }
  if (rules.pattern && value && !rules.pattern.value.test(value)) {
    return rules.pattern.message;
  }
  if (rules.minLength && value && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }
  if (rules.maxLength && value && value.length > rules.maxLength.value) {
    return rules.maxLength.message;
  }
  return null;
};

export const validateForm = (
  data: Record<string, string>,
  schema: Record<string, any>,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const field in schema) {
    const error = validateField(data[field], schema[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};
