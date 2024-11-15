"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useEffect, useState, Suspense } from "react";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  MoreHorizontal,

} from "lucide-react";
import { defaultSidebarItems } from "@/constants";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "@/actions/sidebar";
import { ScrollArea } from "../ui/scroll-area";
import { FolderType, useUnreadCountsStore } from "@/hooks/use-unread-count";
import { getUnreadCounts } from "@/actions/counts";

export function NavProjects() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();

  const { counts, setCounts, setLoading, setError } = useUnreadCountsStore();

  useEffect(() => {
    const loadFavorites = async () => {
      const userFavorites = await getFavorites();
      setFavorites(userFavorites || []);
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const loadUnreadCounts = async () => {
      try {
        setLoading(true);
        const newCounts = await getUnreadCounts();
        setCounts(newCounts);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadUnreadCounts();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadUnreadCounts, 1000);

    return () => clearInterval(interval);
  }, [setCounts, setLoading, setError]);

  const favoriteItems = defaultSidebarItems.filter((item) =>
    favorites?.includes(item.id)
  );

  const toggleFavorite = async (itemId: string) => {
    if (favorites.includes(itemId)) {
      const updatedFavs = await removeFromFavorites(itemId);
      setFavorites(updatedFavs || []);
    } else {
      const updatedFavs = await addToFavorites(itemId);
      setFavorites(updatedFavs || []);
    }
  };

  return (
    <ScrollArea className="rounded-md ">
      <SidebarGroup>
        <SidebarMenu>
          <Collapsible
            defaultOpen={isOpen2}
            onOpenChange={setIsOpen2}
            className="group/collapsible"
          >
            <CollapsibleTrigger className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel className="flex justify-center items-center gap-3">
                {isOpen2 ? (
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                )}
                <h2 className="text-sm">Favoritos</h2>
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {favoriteItems?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    className="flex items-center w-full group-data-[collapsible=icon]:ml-0 ml-6"
                    onClick={() => router.push(item.path)}
                    tooltip={item.label}
                  >
                    <item.iconName className="h-4 w-4" />
                    <span className="truncate flex-grow group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                    {counts &&
                      item.id in counts &&
                      item.id === "inbox" && // Solo mostrar contador para inbox
                      counts[item.id as FolderType] > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {counts[item.id as FolderType]}
                        </span>
                      )}
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">
                          Más opciones para {item.label}
                        </span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side={"right"}
                      align={"center"}
                    >
                      <DropdownMenuItem onClick={() => toggleFavorite(item.id)}>
                        <Folder className="text-muted-foreground mr-2" />
                        <span>
                          {favorites.includes(item.id)
                            ? "Quitar de Favoritos"
                            : "Agregar a Favoritos"}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <Collapsible defaultOpen={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex justify-center items-center gap-3">
              <Suspense fallback={<div className="w-4 h-4" />}>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Suspense>
              <h2 className="text-sm">{session?.user.email}</h2>
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6">
            <SidebarMenu>
              {defaultSidebarItems?.map((item) => (
                <SidebarMenuItem
                  className="group-data-[collapsible=icon]:w-auto"
                  key={item.id}
                >
                  <SidebarMenuButton
                    className={`flex items-center gap-2 w-full ${
                      pathname === item.path && "0 text-blue-500 "
                    }`}
                    onClick={() => router.push(item.path)}
                    tooltip={item.label}
                  >
                    <Suspense fallback={<div className="w-4 h-4" />}>
                      <item.iconName className="h-4 w-4 shrink-0 flex-none" />
                    </Suspense>
                    <span className="truncate flex-grow group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                    {counts &&
                      item.id in counts &&
                      counts[item.id as FolderType] > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {counts[item.id as FolderType]}
                        </span>
                      )}
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">
                          Más opciones para {item.label}
                        </span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side={"right"}
                      align={"center"}
                    >
                      <DropdownMenuItem onClick={() => toggleFavorite(item.id)}>
                        <Folder className="text-muted-foreground mr-2" />
                        <span>
                          {favorites.includes(item.id)
                            ? "Quitar de Favoritos"
                            : "Agregar a Favoritos"}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    </ScrollArea>
  );
}
