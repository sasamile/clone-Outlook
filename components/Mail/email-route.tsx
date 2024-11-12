"use client";

import { Star, ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useState, MouseEvent } from "react";
import { useMailStore } from "@/hooks/new-mail-state";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { EmailResponse } from "@/types";
import { updateEmailReadStatus } from "@/actions/mailfrom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { usePathname } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { useSelectedEmails } from "@/hooks/use-selected-email";
import { useUnreadCountsStore } from "@/hooks/use-unread-count";

// Función helper para agrupar emails por fecha
const groupEmailsByDate = (emails: EmailResponse[]) => {
  const groups: { [key: string]: EmailResponse[] } = {};

  emails.forEach((email) => {
    const date = new Date(email.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey: string;

    if (date.toDateString() === today.toDateString()) {
      groupKey = "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = "Ayer";
    } else if (date.getFullYear() === today.getFullYear()) {
      groupKey = date.toLocaleDateString("es-ES", {
        month: "long",
        day: "numeric",
      });
    } else {
      groupKey = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(email);
  });

  return groups;
};

function EmailPruebas({ emails }: { emails: EmailResponse[] }) {
  const pathname = usePathname();
  const { selectedEmails, setSelectedEmails } = useSelectedEmails();
  const { decrementCount } = useUnreadCountsStore();

  const setSelectedEmail = useMailStore((state) => state.setSelectedEmail);

  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>(
    () => {
      const groups = groupEmailsByDate(emails);
      return Object.keys(groups).reduce(
        (acc, date) => ({
          ...acc,
          [date]: true,
        }),
        {}
      );
    }
  );

  const handleCheckboxClick = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setSelectedEmails(
      selectedEmails.includes(emailId)
        ? selectedEmails.filter((id) => id !== emailId)
        : [...selectedEmails, emailId]
    );
  };

  useEffect(() => {
    // Solo resetear el email seleccionado cuando cambia la ruta
    setSelectedEmail(null);
    const groups = groupEmailsByDate(emails);
    setOpenGroups(
      Object.keys(groups).reduce(
        (acc, date) => ({
          ...acc,
          [date]: true,
        }),
        {}
      )
    );
  }, [pathname]);

  const handleEmailClick = async (email: EmailResponse) => {
    if (selectedEmails.length > 0) {
      const newSelectedEmails = selectedEmails.includes(email.id)
        ? selectedEmails.filter((id) => id !== email.id)
        : [...selectedEmails, email.id];
      setSelectedEmails(newSelectedEmails);
      return;
    }
  
    try {
      // Si el correo no está leído, decrementar el contador
      if (!email.userStates[0]?.isRead) {
        decrementCount("inbox"); // O la carpeta correspondiente
        
        // Actualizar el estado del correo localmente
        email.userStates[0] = {
          ...email.userStates[0],
          isRead: true
        };
      }
  
      await updateEmailReadStatus(email.id);
      setSelectedEmail(email);
    } catch (error) {
      console.error("Error handling email click:", error);
    }
  };


  const emailGroups = React.useMemo(() => groupEmailsByDate(emails), [emails]);

  if (!emails || emails.length === 0) {
    return <div className="p-4 text-gray-500">No emails to display</div>;
  }

  return (
    <div className="space-y-4 cursor-default">
      {Object.entries(emailGroups).map(([date, groupEmails]) => (
        <Collapsible
          key={`${date}-${pathname}`}
          open={openGroups[date]}
          onOpenChange={(isOpen) =>
            setOpenGroups((prev) => ({ ...prev, [date]: isOpen }))
          }
        >
          <CollapsibleTrigger className="flex items-center gap-2 p-2 w-full hover:bg-gray-800/50">
            {openGroups[date] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="font-medium">{date}</span>
            <span className="text-sm text-gray-500">
              ({groupEmails.length})
            </span>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="space-y-[1px]">
              {groupEmails.map((email) => {
                const emailState = email.userStates[0];
                const isSelected = selectedEmails.includes(email.id);

                return (
                  <div
                    key={email.id}
                    className={`relative bg-black/20 hover:bg-black/30 group ${
                      isSelected ? "bg-gray-800/40" : ""
                    }`}
                  >
                    {!emailState?.isRead && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                    )}

                    <div className="px-4 py-2 flex items-center space-x-4">
                      {/* Contenedor del Avatar/Checkbox */}
                      <div
                        className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxClick(e, email.id);
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200  ${
                            isSelected || selectedEmails.length > 0
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100 "
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            className="h-5 w-5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 "
                          />
                        </div>

                        {/* Avatar */}
                        <div
                          className={`transition-opacity duration-200 ${
                            isSelected || selectedEmails.length > 0
                              ? "opacity-0"
                              : "group-hover:opacity-0"
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={email.from.image ?? ""}
                              alt={email.from.name ?? ""}
                            />
                            <AvatarFallback>
                              {(email.from.name ?? "")
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Contenido del Email */}
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => handleEmailClick(email)}
                      >
                        <div className="flex items-center gap-2">
                          {emailState?.starred && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                          <span
                            className={`line-clamp-1 ${
                              !emailState?.isRead
                                ? "text-white font-bold"
                                : "text-gray-300 font-normal"
                            }`}
                          >
                            {email.from.name}
                          </span>
                        </div>
                        <h3
                          className={`mt-1 line-clamp-1 ${
                            !emailState?.isRead
                              ? "font-semibold text-blue-500"
                              : "font-normal text-gray-600"
                          }`}
                        >
                          {email.subject}
                        </h3>
                        <div
                          className="text-sm text-gray-500 font-light line-clamp-1"
                          dangerouslySetInnerHTML={{
                            __html: (email.body ?? "").replace(/<[^>]*>/g, ""),
                          }}
                        />
                      </div>

                      {/* Timestamp */}
                      <div className="text-sm text-gray-500">
                        {new Date(email.date).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <Separator />
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

export default EmailPruebas;
