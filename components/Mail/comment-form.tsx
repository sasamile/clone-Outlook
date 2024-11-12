"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "@/components/ui/input";
import { Editor } from "./editor";
import { RecipientInput } from "./recipient-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { searchUsers } from "@/actions/mailfrom";
import { useUploadthing } from "@/hooks/new-mail-state";
import { createComment } from "@/actions/mailfrom/comment";
import { toast } from "sonner";
import { File, Image } from "lucide-react";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import {
  FileArchive,
  FileText,
  FileImage,
  Film,
  Music,
  FileCode,
} from "lucide-react";

const CommentFormSchema = z.object({
  subject: z.string().min(1, "El asunto es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
});

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

type CommentFormValues = z.infer<typeof CommentFormSchema>;

export function CommentForm({
  emailId,
  onCommentCreated,
  setIsOpen,
}: {
  emailId: string;
  onCommentCreated: () => void;
  setIsOpen: (value: boolean) => void;
}) {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  });

  const { filesPreviews, setFilesPreviews } = useUploadthing();

  const onSubmit = async (values: CommentFormValues) => {
    try {
      await createComment({
        emailId,
        subject: values.subject,
        content: values.content,
        attachments: filesPreviews,
      });

      form.reset();
      setFilesPreviews([]);
      onCommentCreated();
      setIsOpen(false);
      toast.success("Comentario agregado con éxito");
    } catch (error) {
      toast.error("Error al crear el comentario");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="subject"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asunto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Asunto del comentario" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Editor {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {filesPreviews.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Archivos adjuntos:</h3>
            <div className="space-y-2">
              {filesPreviews.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-muted rounded"
                >
                  <div className="flex items-center gap-2">
                    {file.type.includes("image") ? (
                      <Image className="w-5 h-5" />
                    ) : (
                      getFileIcon(file.type)
                    )}
                    <span className="text-sm">{file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="submit">Enviar Comentario</Button>
      </form>
    </Form>
  );
}
