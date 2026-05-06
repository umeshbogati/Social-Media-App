import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { Header } from "../Header";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          px: 2,
          py: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;