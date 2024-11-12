"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

interface CommentData {
  emailId: string;
  subject: string;
  content: string;
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
}

export async function createComment({
    emailId,
    subject,
    content,
    attachments,
  }: CommentData) {
    try {
      const user = await currentUser();
      if (!user) {
        throw new Error("No autorizado");
      }
  
      // Obtener el email y sus participantes
      const email = await db.email.findUnique({
        where: { id: emailId },
        include: {
          from: true,
          toRecipients: {
            include: { user: true }
          },
          ccRecipients: {
            include: { user: true }
          }
        }
      });
  
      if (!email) {
        throw new Error("Email no encontrado");
      }
  
      // Crear el comentario
      const comment = await db.comment.create({
        data: {
          subject,
          content,
          userId: user.id,
          emailId,
          attachments: {
            create: attachments.map((file) => ({
              name: file.name,
              url: file.url,
              type: file.type,
            })),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          attachments: true,
        },
      });
  
      // Obtener todos los participantes del email
      const participantes = [
        email.fromId,
        ...email.toRecipients.map(r => r.userId),
        ...(email.ccRecipients?.map(r => r.userId) || [])
      ];
  
      // Actualizar estados para todos los participantes
      for (const participanteId of participantes) {
        // Obtener el estado actual del email para este participante
        const currentState = await db.userEmailState.findUnique({
          where: {
            userId_emailId: {
              userId: participanteId,
              emailId,
            },
          }
        });
  
        if (participanteId === user.id) {
          // Para el autor del comentario: mantener su carpeta actual
          await db.userEmailState.upsert({
            where: {
              userId_emailId: {
                userId: participanteId,
                emailId,
              },
            },
            create: {
              userId: participanteId,
              emailId,
              folder: currentState?.folder || "sent",
              isRead: true,
            },
            update: {
              isRead: true,
            },
          });
        } else {
          // Para los demás: mantener su carpeta actual pero marcar como no leído
          await db.userEmailState.upsert({
            where: {
              userId_emailId: {
                userId: participanteId,
                emailId,
              },
            },
            create: {
              userId: participanteId,
              emailId,
              folder: currentState?.folder || "inbox",
              isRead: false,
            },
            update: {
              isRead: false,
            },
          });
        }
      }
  
      return comment;
    } catch (error) {
      console.error("Error al crear comentario:", error);
      throw new Error("No se pudo crear el comentario");
    }
  }