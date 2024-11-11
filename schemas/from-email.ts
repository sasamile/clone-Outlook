import { z } from "zod";

export const EmailFormSchema = z.object({
  toRecipients: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        image: z.string().nullable(),
      })
    )
    .min(1, "Debe agregar al menos un destinatario"),
  ccRecipients: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string().nullable(),
      image: z.string().nullable(),
    })
  ),
  subject: z.string().min(1, "El asunto es requerido"),
  body: z.string().min(1, "El mensaje es requerido"),
});

export const UploadthingShecma = z.object({
  file: z.array(z.string().min(1, "El archivo es requerido")),
});
