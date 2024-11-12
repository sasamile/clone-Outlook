"use server"

import { currentUser } from "@/lib/auth-user"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id?: string) => {
  if (!id) {
    return null
  }

  try {
    const userFound = await db.user.findUnique({
      where: {
        id,
      },
    })

    return userFound
  } catch {
    return null
  }
}

export async function changeRole(userId: string, role: UserRole) {
  if (!userId) {
    return { error: "ID del usuario requerido." }
  }

  if (!role) {
    return { error: "Role requerido." }
  }
  try {
    await db.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath("/")
    revalidatePath("/members")

    return { success: "Nuevo role asignado." }
  } catch {
    return { error: "Algo salió mal en la solicitud." }
  }
}


export async function getEmailById(emailId: string) {
  try {
  
    const email = await db.email.findUnique({
      where: { id: emailId },
      include: {
        from: true,
        toRecipients: {
          include: { user: true }
        },
        attachments: true,
        comments: {
          include: {
            user: true,
            attachments: true
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        userStates: true
      }
    });

    return email;
  } catch (error) {
    console.error("Error fetching email:", error);
    return null;
  }
}