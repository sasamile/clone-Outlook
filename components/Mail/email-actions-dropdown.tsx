import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultSidebarItems } from "@/constants";
import { useState } from "react";
import { Archive } from "lucide-react";
import { toast } from "sonner"; // Asumiendo que usas sonner para notificaciones
import { useSelectedEmails } from "@/hooks/use-selected-email";
import { moveEmailsToFolder } from "@/actions/folder-mail/move-email-folder";

export function EmailActionsDropdown() {
  const { selectedEmails, clearSelectedEmails } = useSelectedEmails();
  const [isLoading, setIsLoading] = useState(false);

  // Solo mostrar las carpetas relevantes para mover emails
  const folderItems = defaultSidebarItems.filter((item) =>
    ["inbox", "archive", "trash", "starred"].includes(item.id)
  );

  const handleMoveToFolder = async (folderId: string) => {
    if (selectedEmails.length === 0) return;

    setIsLoading(true);
    try {
      const result = await moveEmailsToFolder(selectedEmails, folderId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        `Emails movidos a ${
          folderItems.find((item) => item.id === folderId)?.label
        }`
      );
      clearSelectedEmails();
    } catch (error) {
      toast.error("Error al mover los emails");
      console.error("Error moving emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedEmails.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          <span className="sr-only"></span>
          <Archive className="h-4 w-4 text-green-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {folderItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => handleMoveToFolder(item.id)}
            disabled={isLoading}
          >
            <item.iconName className="mr-2 h-4 w-4" />
            <span>Mover a {item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
