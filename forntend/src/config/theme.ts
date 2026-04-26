// filepath: src/config/theme.ts
export const theme = {
  colors: {
    primary: "#1877f2",
    secondary: "#45bd62",
    danger: "#e41e3f",
    warning: "#f7b928",
    background: "#f0f2f5",
    surface: "#ffffff",
    text: "#050505",
    textSecondary: "#65676b",
    border: "#ced0d4",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "50%",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
    md: "0 2px 4px rgba(0, 0, 0, 0.1)",
    lg: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
};

export type Theme = typeof theme;
