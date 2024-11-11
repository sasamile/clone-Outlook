"use client";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useNewMailStore, useUploadthing } from "@/hooks/new-mail-state";
import { UploadDropzone } from "@/lib/uploadthing";
import { UploadthingShecma } from "@/schemas/from-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  FileArchive,
  FileText,
  FileImage,
  Film,
  Music,
  FileCode,
} from "lucide-react";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { deleteImageFile } from "@/actions/uploadthing-actions";

function FormUploadthing() {
  const isOpen = useUploadthing((state) => state.isUploadthingOpen);
  const { setisUploadthingOpen } = useUploadthing();
  const { filesPreviews, setFilesPreviews } = useUploadthing();
  const totalFiles = filesPreviews.length;

  const form = useForm<z.infer<typeof UploadthingShecma>>({
    resolver: zodResolver(UploadthingShecma),
    defaultValues: {
      file: [],
    },
  });

  const handleDeleteFile = async (
    fileUrl: string,
    index: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
    e.stopPropagation(); // Detener propagación del evento

    try {
      const fileKey = fileUrl.split("/").pop() || "";
      await deleteImageFile(fileKey);

      const newFiles = [...filesPreviews];
      newFiles.splice(index, 1);
      setFilesPreviews(newFiles);
    } catch (error) {
      toast.error("Error al eliminar el archivo");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <FileImage className="w-8 h-8" />;
    if (fileType.includes("pdf"))
      return <BsFileEarmarkPdfFill className="w-8 h-8" />;
    if (fileType.includes("video")) return <Film className="w-8 h-8" />;
    if (fileType.includes("audio")) return <Music className="w-8 h-8" />;
    if (fileType.includes("zip") || fileType.includes("rar"))
      return <FileArchive className="w-8 h-8" />;
    if (fileType.includes("msword") || fileType.includes("wordprocessingml"))
      return <FileText className="w-8 h-8" />;
    if (
      fileType.includes("code") ||
      fileType.includes("javascript") ||
      fileType.includes("json")
    )
      return <FileCode className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setisUploadthingOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir Archivos ({totalFiles}/10)</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form>
              <div>
                {totalFiles < 10 && (
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="courseAttachment"
                            onChange={(newFiles) => {
                              field.onChange(newFiles);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <div className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
                    {filesPreviews.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {file.type.includes("image") ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-8 h-8 object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="flex-shrink-0">
                              {getFileIcon(file.type)}
                            </div>
                          )}
                          <span className="truncate text-sm flex-1">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 ml-2"
                          onClick={(e) => handleDeleteFile(file.url, index, e)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FormUploadthing;

interface FileUploadProps {
  onChange: (urls: string[]) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const { filesPreviews, setFilesPreviews } = useUploadthing();

  return (
    <UploadDropzone
      endpoint={endpoint}
      config={{ mode: "auto" }}
      appearance={{
        button: "bg-blue-500 text-white",
        allowedContent: "text-muted-foreground text-xs",
      }}
      content={{
        allowedContent: "Archivos hasta 32MB",
        button({ ready }) {
          if (ready) return <div className="py-2">Seleccionar archivos</div>;
          return "Cargando...";
        },
      }}
      onClientUploadComplete={(res) => {
        const newFiles =
          res?.map((file) => ({
            url: file.url,
            name: file.name,
            type: file.type || "application/octet-stream",
          })) || [];

        // Verificar que no exceda el límite de 10 archivos
        const totalFiles = filesPreviews.length + newFiles.length;
        if (totalFiles > 10) {
          toast.error("No puedes subir más de 10 archivos");
          return;
        }

        setFilesPreviews([...filesPreviews, ...newFiles]);
        onChange([...filesPreviews, ...newFiles].map((file) => file.url));
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
      onUploadBegin={() => {
        // Opcional: Mostrar un indicador de carga
        toast.info("Iniciando carga de archivos...");
      }}
    />
  );
};
