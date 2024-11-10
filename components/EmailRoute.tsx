"use client";

import { Separator } from "@radix-ui/react-separator";
import { Filter, Star, Pin } from "lucide-react";
import React, { useState } from "react";
import { EmailDetail } from "./DetailEmail";

export const emailsData = [
  {
    id: "1",
    subject: "Reunión de proyecto",
    body: "Buenos días, necesitamos coordinar la reunión del proyecto para la próxima semana...",
    date: new Date("2024-03-20T10:00:00"),
    read: false,
    starred: true,
    pinned: false,
    folder: "INBOX",
    archived: false,
    fromId: "user1",
    from: {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
    },
    toId: "user2",
  },
  {
    id: "2",
    subject: "Informe mensual",
    body: "Adjunto el informe mensual de actividades...",
    date: new Date("2024-03-19T15:30:00"),
    read: true,
    starred: false,
    pinned: true,
    folder: "INBOX",
    archived: false,
    fromId: "user3",
    from: {
      name: "María García",
      email: "maria@ejemplo.com",
    },
    toId: "user2",
  },
  {
    id: "3",
    subject: "Actualización de proyecto",
    body: "Hemos completado la fase inicial del proyecto...",
    date: new Date("2024-03-18T09:15:00"),
    read: false,
    starred: false,
    pinned: false,
    folder: "INBOX",
    archived: false,
    fromId: "user4",
    from: {
      name: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
    },
    toId: "user2",
  },
  {
    id: "3",
    subject: "Actualización de proyecto",
    body: "Hemos completado la fase inicial del proyecto...",
    date: new Date("2024-03-18T09:15:00"),
    read: false,
    starred: false,
    pinned: false,
    folder: "INBOX",
    archived: false,
    fromId: "user4",
    from: {
      name: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
    },
    toId: "user2",
  },
  {
    id: "3",
    subject: "Actualización de proyecto",
    body: "Hemos completado la fase inicial del proyecto...",
    date: new Date("2024-03-18T09:15:00"),
    read: false,
    starred: false,
    pinned: false,
    folder: "INBOX",
    archived: false,
    fromId: "user4",
    from: {
      name: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
    },
    toId: "user2",
  },
  {
    id: "3",
    subject: "Actualización de proyecto",
    body: "Hemos completado la fase inicial del proyecto...",
    date: new Date("2024-03-18T09:15:00"),
    read: false,
    starred: false,
    pinned: false,
    folder: "INBOX",
    archived: false,
    fromId: "user4",
    from: {
      name: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
    },
    toId: "user2",
  },
];
interface EmailDetailProps {
  selectedEmail: (typeof emailsData)[0] | null;
  setSelectedEmail: (email: (typeof emailsData)[0]) => void; // Changed this line
}

function EmailPruebas({ setSelectedEmail }: EmailDetailProps) {
  return (
    <div className="p-4 ">
      <div className="space-y-2">
        {emailsData.map((email) => (
          <div
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className="p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {email.starred && (
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
                {email.pinned && <Pin className="w-4 h-4 text-blue-400" />}
                <span
                  className={`font-medium ${
                    !email.read ? "text-white" : "text-gray-600"
                  }`}
                >
                  {email.from.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(email.date).toLocaleDateString()}
              </span>
            </div>
            <h3
              className={`mt-1 ${
                !email.read ? "font-semibold" : "font-normal text-gray-600"
              }`}
            >
              {email.subject}
            </h3>
            <p className="text-sm text-gray-500 truncate mt-1">{email.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmailPruebas;
