import React from "react";
import { useLocation } from "react-router-dom";
import { redirectForPath, resolvePath } from "@/lib/routes";
import { isTripDetailRoute } from "@/lib/tripPrograms";
import HomeDictationWidget from "./HomeDictationWidget";

// Presentation and form logic remain in the original shared widget. This
// wrapper only decides which public routes can show it.
export default function GlobalDictationWidget() {
  const { pathname } = useLocation();
  const { routeId } = resolvePath(redirectForPath(pathname) || pathname);
  if (isTripDetailRoute(routeId)) return null;

  // Navigation unmounts any open dialog/recorder and resets its form context.
  return <HomeDictationWidget key={pathname} />;
}
