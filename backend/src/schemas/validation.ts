export const validateRegister = (data: any) => {
  const errors: string[] = [];
  if (!data.username || data.username.length < 3)
    errors.push("Username must be at least 3 characters");
  if (!data.name || data.name.length < 2)
    errors.push("Name must be at least 2 characters");
  if (!data.email || !data.email.includes("@"))
    errors.push("Valid email required");
  if (!data.password || data.password.length < 8)
    errors.push("Password must be at least 8 characters");
  return errors;
};

export const validateLogin = (data: any) => {
  const errors: string[] = [];
  if (!data.email || !data.email.includes("@"))
    errors.push("Valid email required");
  if (!data.password) errors.push("Password required");
  return errors;
};

export const validateCreatePost = (data: any) => {
  const errors: string[] = [];
  if (!data.description || data.description.length < 1)
    errors.push("Description required");
  return errors;
};

export const validateEditPost = (data: any) => {
  const errors: string[] = [];
  if (data.description && data.description.length < 1)
    errors.push("Description cannot be empty");
  return errors;
};

export const validateComment = (data: any) => {
  const errors: string[] = [];
  if (!data.text || data.text.length < 1) errors.push("Comment text required");
  return errors;
};
