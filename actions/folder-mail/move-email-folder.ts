"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

export const moveEmailsToFolder = async (emailIds: string[], folder: string) => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return { error: "User not found", status: 401 };
    }

    // Actualizar el estado de cada email seleccionado
    await db.userEmailState.updateMany({
      where: {
        userId: user.id,
        emailId: {
          in: emailIds,
        },
      },
      data: {
        folder: folder,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[MOVE_EMAILS_ERROR]", error);
    return { error: "Failed to move emails", status: 500 };
  }
};