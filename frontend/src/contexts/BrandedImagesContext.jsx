import React, { createContext, useContext } from "react";

/* ----------------------------------------------------------------
   BrandedImagesContext
   ------------------------------------------------------------
   Opt-in flag that tells shared image components (JourneyHero,
   EditorialBlock, ItineraryBlock, overview/hub cards, etc.) to
   overlay the Xaluca brand badges (logo + "X" monogram) on their
   static images. Only the pages wrapped in <BrandedImagesProvider>
   render the badges, keeping the rest of the site untouched.
---------------------------------------------------------------- */
const BrandedImagesContext = createContext(false);

export const BrandedImagesProvider = ({ children }) => (
  <BrandedImagesContext.Provider value={true}>
    {children}
  </BrandedImagesContext.Provider>
);

export const useBrandedImages = () => useContext(BrandedImagesContext);

export default BrandedImagesContext;
