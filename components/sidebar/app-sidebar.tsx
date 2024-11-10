"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { useCurrentUser } from "@/hooks/use-current-user";



export function AppSidebar() {
  const user = useCurrentUser();
  const navusedata = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.image ?? "",
  };

  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader>
        <TeamSwitcher entity={user?.entity} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navusedata} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
