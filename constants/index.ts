import {
  AlertCircle,
  Archive,
  Clock,
  File,
  Inbox,
  Mail,
  Send,
  Star,
  Trash,
} from "lucide-react";

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
    id: "spam",
    label: "Spam",
    iconName: Clock,
    path: "/spam",
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
  {
    id: "all",
    label: "Todos los correos",
    iconName: Mail,
    path: "/all",
  },
  {
    id: "important",
    label: "Importantes",
    iconName: AlertCircle,
    path: "/important",
  },
];
