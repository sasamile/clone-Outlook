"use server"

import { FolderType, UnreadCounts } from "@/hooks/use-unread-count";
import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

export const getUnreadCounts = async (): Promise<UnreadCounts> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not found");

    const emails = await db.email.findMany({
      where: {
        userStates: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        userStates: {
          where: {
            userId: user.id,
          },
          select: {
            folder: true,
            isRead: true,
          },
        },
      },
    });

    const counts: UnreadCounts = {
      inbox: 0,
      sent: 0,
      drafts: 0,
      starred: 0,
      trash: 0,
      archive: 0,
    };

    emails.forEach((email) => {
      const userState = email.userStates[0];
      if (userState && !userState.isRead) {
        // Contar mensajes no leídos para cada carpeta
        counts[userState.folder as FolderType]++;
      }
    });

    return counts;
  } catch (error) {
    console.error("Error getting unread counts:", error);
    throw error;
  }
};