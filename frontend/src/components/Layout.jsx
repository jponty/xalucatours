import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import FloatingLanguageSwitcher from "./FloatingLanguageSwitcher";
import BestMonthFab from "./BestMonthFab";
import { Toaster } from "@/components/ui/sonner";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2621]">
      <Header />
      <Breadcrumbs />
      <main>{children}</main>
      <Footer />
      <FloatingLanguageSwitcher />
      <BestMonthFab />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Layout;
