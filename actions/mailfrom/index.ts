"use server";

import { EmailFormValues } from "@/components/Mail/new-email";
import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { useUnreadCountsStore } from "@/hooks/use-unread-count";

export async function searchUsers(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const users = await db.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 10,
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}
export async function createDraftEmail(userId: string) {
  try {
    const draft = await db.email.create({
      data: {
        fromId: userId,
        subject: "",
        body: "",
        userStates: {
          create: {
            userId: userId,
            folder: "drafts",
          },
        },
      },
    });
    return draft;
  } catch (error) {
    console.error("Error creating draft:", error);
    throw new Error("Failed to create draft email");
  }
}

interface UpdateEmailProps {
  value: EmailFormValues;
  filesPreviews: {
    name: string;
    url: string;
    type: string;
  }[]; // Changed from Attachment
  draftId: string;
  folder?: string;
}

export async function UpdateEmail({
  value,
  filesPreviews,
  draftId,
}: UpdateEmailProps) {
  const { body, ccRecipients, subject, toRecipients } = value;
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    // Actualizar el email y crear estados para todos los destinatarios
    const res = await db.email.update({
      where: {
        id: draftId,
      },
      data: {
        subject,
        body,
        attachments: {
          create: filesPreviews.map((file) => ({
            name: file.name,
            url: file.url,
            type: file.type,
          })),
        },
        toRecipients: {
          create: toRecipients.map((recipient) => ({
            userId: recipient.id,
          })),
        },
        ccRecipients: {
          create: ccRecipients.map((recipient) => ({
            userId: recipient.id,
          })),
        },
        userStates: {
          // Cambiado de EmailState a userStates
          update: {
            where: {
              userId_emailId: {
                userId: user.id,
                emailId: draftId,
              },
            },
            data: {
              folder: "sent", // Cambiado de "send" a "sent"
            },
          },
          // Crear estados para todos los destinatarios
          create: [...toRecipients, ...ccRecipients].map((recipient) => ({
            userId: recipient.id,
            folder: "inbox",
            isRead: false,
          })),
        },
      },
      include: {
        attachments: true,
        toRecipients: true,
        ccRecipients: true,
        userStates: true,
      },
    });
    return res;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export const handleDeletes = async (id: string) => {
  try {
    const res = await db.email.deleteMany({
      where: {
        id,
      },
    });
    return res;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

//updateRead

export async function updateEmailReadStatus(emailId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authorized");
    }
    const currentState = await db.userEmailState.findUnique({
      where: {
        userId_emailId: {
          userId: user.id,
          emailId: emailId,
        },
      },
    });

    // Buscar o crear el estado del email para este usuario
    const emailState = await db.userEmailState.upsert({
      where: {
        userId_emailId: {
          userId: user.id,
          emailId: emailId,
        },
      },
      create: {
        userId: user.id,
        emailId: emailId,
        isRead: true,
        readAt: new Date(),
      },
      update: {
        isRead: true,
        readAt: new Date(),
      },
    });

    useUnreadCountsStore.getState().updateCount("inbox", -1);

    return emailState;
  } catch (error) {
    console.error("Error updating email read status:", error);
    throw new Error("Failed to update email read status");
  }
}
