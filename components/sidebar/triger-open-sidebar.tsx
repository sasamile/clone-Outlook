"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import { useNewMailStore } from "@/hooks/new-mail-state";

function TrigerOpenSidebar() {
  const setNewMail = useNewMailStore((state) => state.setNewMail);

  return (
    <div>
      <div className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Button
            className="bg-blue-500 hover:bg-blue-300"
            onClick={() => setNewMail(true)}
          >
            <Mail />
            Correo nuevo
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TrigerOpenSidebar;
