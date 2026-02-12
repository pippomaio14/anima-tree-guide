import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { useAuth } from "@/hooks/useAuth";

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

const MobileLayout = ({ children, hideNav = false }: MobileLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={`flex-1 ${!hideNav && user ? "pb-20" : ""}`}>
        {children}
      </main>
      {!hideNav && user && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
