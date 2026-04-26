// filepath: src/config/app.ts
export const appConfig = {
  appName: "Social Media App",
  version: "1.0.0",
  environment: import.meta.env.MODE || "development",
  debug: import.meta.env.DEV,
};

export const routesConfig = {
  home: "/",
  login: "/login",
  register: "/register",
  profile: "/profile",
  post: "/post/:id",
};

export const paginationConfig = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 50,
};
