"use client";

import { useEffect, useState } from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

const STORAGE_KEY = "dashboard:sidebar-collapsed";

function setBodyAttribute(value: boolean) {
  if (typeof document === "undefined") return;
  document.body.setAttribute("data-sidebar-collapsed", value ? "true" : "false");
}

export function SidebarCollapseToggle() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial = stored === "true";
    setCollapsed(initial);
    setBodyAttribute(initial);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBodyAttribute(collapsed);
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "true" : "false");
  }, [collapsed]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={collapsed}
      onClick={() => setCollapsed((value) => !value)}
      className="hidden lg:inline-flex"
    >
      {collapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
