"use server"

import { FolderType } from "@/hooks/use-unread-count";
import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";


export async function getUnreadCounts() {
  try {
    const user = await currentUser();
    
    if (!user) {
      throw new Error("Unauthorized");
    }

    const [inbox, sent, drafts, starred, trash, archived] = await Promise.all([
      // Inbox no leídos del usuario actual
      db.email.count({
        where: {
          userStates: {
            some: {
              userId: user.id,
              folder: "inbox",
              isRead: false,
            },
          },
          toRecipients: {
            some: {
              userId: user.id,
            },
          },
        },
      }),
      // Enviados nuevos del usuario actual
      db.email.count({
        where: {
          fromId: user.id,
          userStates: {
            some: {
              userId: user.id,
              folder: "sent",
              isRead: false,
            },
          },
        },
      }),
      // Borradores del usuario actual
      db.email.count({
        where: {
          fromId: user.id,
          userStates: {
            some: {
              userId: user.id,
              folder: "drafts",
            },
          },
        },
      }),
      // Destacados no leídos del usuario actual
      db.email.count({
        where: {
          userStates: {
            some: {
              userId: user.id,
              starred: true,
              isRead: false,
            },
          },
          OR: [
            { fromId: user.id },
            {
              toRecipients: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
      }),
      // En papelera del usuario actual
      db.email.count({
        where: {
          userStates: {
            some: {
              userId: user.id,
              folder: "trash",
            },
          },
          OR: [
            { fromId: user.id },
            {
              toRecipients: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
      }),
      // Archivados no leídos del usuario actual
      db.email.count({
        where: {
          userStates: {
            some: {
              userId: user.id,
              folder: "archived",
              isRead: false,
            },
          },
          OR: [
            { fromId: user.id },
            {
              toRecipients: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
      }),
    ]);

    return {
      inbox,
      sent,
      drafts,
      starred,
      trash,
      archived,
    } as Record<FolderType, number>;
  } catch (error) {
    console.error("[UNREAD_COUNTS]", error);
    throw error;
  }
}