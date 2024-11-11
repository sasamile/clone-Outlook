"use server"

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


