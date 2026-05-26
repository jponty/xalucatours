import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingLanguageSwitcher from "./FloatingLanguageSwitcher";
import { Toaster } from "@/components/ui/sonner";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2621]">
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingLanguageSwitcher />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Layout;
