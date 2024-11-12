import { Archive, File, Inbox, Send, Star, Trash } from "lucide-react";

export const entities = ["Piedemonte", "Cliente"];

export const defaultSidebarItems = [
  {
    id: "inbox",
    label: "Bandeja de entrada",
    iconName: Inbox,
    path: "/",
  },
  {
    id: "sent",
    label: "Enviados",
    iconName: Send,
    path: "/sent",
  },
  {
    id: "draft",
    label: "Borradores",
    iconName: File,
    path: "/draft",
  },
  {
    id: "starred",
    label: "Destacados",
    iconName: Star,
    path: "/starred",
  },
  {
    id: "trash",
    label: "Papelera",
    iconName: Trash,
    path: "/trash",
  },
  {
    id: "archive",
    label: "Archivo",
    iconName: Archive,
    path: "/archive",
  },
];
