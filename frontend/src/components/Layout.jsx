import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import BestMonthFab from "./BestMonthFab";
import NarrationMiniPlayer from "./NarrationMiniPlayer";
import VirtualAssistantInfoModal from "./VirtualAssistantInfoModal";
import ExitIntentModal from "./ExitIntentModal";
import WhatsAppContactModal from "./WhatsAppContactModal";
import { Toaster } from "@/components/ui/sonner";
import { TripFloatingProvider, TripFloatingSlot } from "./TripFloatingActions";

export const Layout = ({ children }) => {
  return (
    <TripFloatingProvider>
      <div className="min-h-screen bg-[#FDFBF7] text-[#2C2621]">
        <Header />
        <Breadcrumbs />
        <main>{children}</main>
        <Footer />
        <div className="trip-floating-page-clearance" aria-hidden="true" />
        <BestMonthFab />
        <TripFloatingSlot name="audio"><NarrationMiniPlayer /></TripFloatingSlot>
        <VirtualAssistantInfoModal />
        <ExitIntentModal />
        <WhatsAppContactModal />
        <Toaster position="bottom-right" style={{ "--offset-bottom": "calc(var(--trip-floating-clearance, 0px) + 24px)", "--mobile-offset-bottom": "calc(var(--trip-floating-clearance, 0px) + 16px)" }} />
      </div>
    </TripFloatingProvider>
  );
};

export default Layout;
