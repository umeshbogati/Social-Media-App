// filepath: src/components/Layout/MainLayout.tsx
import { ReactNode } from "react";
import { Header } from "../Header";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
