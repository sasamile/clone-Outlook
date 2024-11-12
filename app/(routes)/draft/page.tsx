"use client";

import { FolderDraftsMail } from "@/actions/folder-mail/send/inde";
import { getFavorites } from "@/actions/sidebar";
import EmailPruebas from "@/components/Mail/email-route";
import { Separator } from "@/components/ui/separator";
import { EmailResponse } from "@/types";
import { Filter, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

function page() {
  const pathname = usePathname();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const userFavorites = await getFavorites();
      setFavorites(userFavorites || []);
    };
    loadFavorites();
  }, []);

  const { data: sentEmails, isLoading } = useSWR(
    pathname === "/draft" ? "draft-emails" : null, // Solo cargar si estamos en /sent
    async () => {
      try {
        const emails = await FolderDraftsMail();
        return emails as EmailResponse[];
      } catch (error) {
        console.error("Error fetching sent emails:", error);
        return [];
      }
    },
    {
      refreshInterval: 2000,
      revalidateOnFocus: true,
      dedupingInterval: 2000, // Evita múltiples solicitudes en un corto período
      keepPreviousData: false, // No mantener datos anteriores al cambiar de ruta
    }
  );
  return (
    <div className="bg-sidebar rounded-md h-full">
      <div className="py-4 flex justify-between items-center px-4">
        <div className="flex items-center gap-2 ml-12">
          <h2 className="font-semibold">Borradores</h2>
          <Star
            className={`w-4 h-4 ${
              favorites.includes("draft")
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          />
        </div>
        <Filter className="w-4 h-4" />
      </div>
      <Separator />{" "}
      {isLoading ? (
        <div className="p-4 text-center">Cargando...</div>
      ) : (
        <EmailPruebas emails={sentEmails || []} key={pathname} />
      )}
    </div>
  );
}

export default page;
