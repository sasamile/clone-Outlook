"use client";

import { Star, Pin, ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const setSelectedEmail = useMailStore((state) => state.setSelectedEmail);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setSelectedEmail(null);
    setOpenGroups({}); // Resetear grupos abiertos
  }, [pathname, setSelectedEmail]);

  const handleEmailClick = async (email: EmailResponse) => {
    try {
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
    <div className="space-y-4">
      {Object.entries(emailGroups).map(([date, groupEmails]) => (
        <Collapsible
          key={`${date}-${pathname}`}
          defaultOpen={date === "Hoy"}
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
            <div className="">
              {groupEmails.map((email) => {
                const emailState = email.userStates[0];

                return (
                  <React.Fragment key={email.id}>
                    <div
                      onClick={() => handleEmailClick(email)}
                      className="px-4 py-2 transition-colors relative bg-black/20 hover:bg-black/30"
                    >
                      {!emailState?.isRead && (
                        <div className="absolute bg-blue-500 inset-0 w-2"></div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 justify-center items-center">
                          <Avatar className="h-12 w-12 rounded-full">
                            <AvatarImage
                              src={email.from.image ?? ""}
                              alt={email.from.name ?? ""}
                            />
                            <AvatarFallback className="rounded-lg">
                              {(email.from.name ?? "")
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="flex items-center gap-3">
                              {emailState?.starred && (
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              )}
                              {/* Nota: pinned no está en la interfaz UserEmailState, 
                         necesitarías añadirlo si lo necesitas */}
                              <span
                                className={`uppercase line-clamp-1 ${
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
                                __html: (email.body ?? "").replace(
                                  /<[^>]*>/g,
                                  ""
                                ),
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(email.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Separator />
                  </React.Fragment>
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
