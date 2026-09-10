import { useEffect } from "react";
import { registerPublicPageTool } from "@/lib/agentDiscovery";

export default function AgentDiscovery() {
  useEffect(() => registerPublicPageTool(document.modelContext || navigator.modelContext), []);
  return null;
}
