"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchUsers, UpdateEmail } from "@/actions/mailfrom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { File, Image, Loader2, Trash } from "lucide-react";
import {
  useNewMailStore,
  UseTrash,
  useUploadthing,
} from "@/hooks/new-mail-state";
import { RecipientInput } from "./recipient-input";
import { Editor } from "./editor";
import { EmailFormSchema } from "@/schemas/from-email";
import {
  FileArchive,
  FileText,
  FileImage,
  Film,
  Music,
  FileCode,
} from "lucide-react";

import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { toast } from "sonner";
import { DeleteDialog } from "./modal-confirm-delete";

export type EmailFormValues = z.infer<typeof EmailFormSchema>;

export default function NewEmail() {
  const draftId = useNewMailStore((state) => state.draftId);
  const filesPreviews = useUploadthing((state) => state.filesPreviews);
  const isTrashOpen = UseTrash((state) => state.isTrashOpen);
  const { setIsTrashOpen } = UseTrash();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      toRecipients: [],
      ccRecipients: [],
      subject: "",
      body: "",
    },
  });

  useEffect(() => {
    if (draftId) {
      const loadDraft = async () => {
        console.log("Loading draft:", draftId);
      };
      loadDraft();
    }
  }, [draftId]);
  const { isSubmitting } = form.formState;


  const onSubmit = async (values: EmailFormValues) => {
    try {
      await UpdateEmail({
        value: values,
        filesPreviews: filesPreviews,
        draftId: draftId || "",
      });
      useNewMailStore.getState().setDraftId(null);
      useNewMailStore.getState().setNewMail(false);
      useUploadthing.getState().setFilesPreviews([]);

      toast.success("Email Enviado con Exito");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.log(error);
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

  const onSaveDraft = async () => {
    try {
      const values = form.getValues();
      await UpdateEmail({
        value: values,
        filesPreviews: filesPreviews.map((file) => ({
          ...file,
          id: "",
          createdAt: new Date(),
          emailId: "",
        })),
        draftId: draftId || "",
      });

      useNewMailStore.getState().setDraftId(null);
      useNewMailStore.getState().setNewMail(false);
      useUploadthing.getState().setFilesPreviews([]);

      toast.success("Borrador guardado con éxito");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.log(error);
    }
  };

  return (
    <div className="py-6 px-12 overflow-y-auto h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                )}
                Enviar Email
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isSubmitting}
                onClick={onSaveDraft}
              >
                Guardar Borrador
              </Button>
            </div>
            <Button onClick={() => setIsTrashOpen(true)}>
              <Trash />
            </Button>
          </div>
          <div className="space-y-4">
            <FormField
              name="toRecipients"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Para</FormLabel>
                  <FormControl>
                    <RecipientInput
                      label="Agregar destinatarios"
                      recipients={field.value}
                      onRecipientsChange={field.onChange}
                      onSearch={searchUsers}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ccRecipients"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CC</FormLabel>
                  <FormControl>
                    <RecipientInput
                      label="Agregar destinatarios en CC"
                      recipients={field.value}
                      onRecipientsChange={field.onChange}
                      onSearch={searchUsers}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="subject"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese el asunto"
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="body"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje</FormLabel>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
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
          </div>
        </form>
      </Form>
      <DeleteDialog id={draftId || ""} />
    </div>
  );
}
