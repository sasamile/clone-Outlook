"use client";
import { handleDeletes } from "@/actions/mailfrom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewMailStore, UseTrash } from "@/hooks/new-mail-state";
import { toast } from "sonner";

interface DeleteDialogProps {
  id: string | null;
}
export function DeleteDialog({ id }: DeleteDialogProps) {
  const { isTrashOpen, setIsTrashOpen } = UseTrash();

  const handleDelete = () => {
    try {
      if (id) {
        handleDeletes(id);
        useNewMailStore.getState().setNewMail(false);
        setIsTrashOpen(false);
        toast.success("Email Eliminado");
      }
    } catch (error) {
      console.log(error);
      toast.error("Algo Fallo");
    }
  };

  const handleClose = () => {
    setIsTrashOpen(false);
  };

  return (
    <Dialog open={isTrashOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar eliminación?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. ¿Estás seguro de que quieres
            eliminar este email?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
