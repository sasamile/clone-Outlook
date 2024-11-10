"use server"
import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

export async function addToFavorites(itemId: string) {
  const user = await currentUser();
  if (!user?.id) return null;

  const userItem = await db.user.update({
    where: { id: user.id },
    data: {
      sidebarItems: {
        push: itemId,
      },
    },
  });

  return userItem.sidebarItems;
}

export async function removeFromFavorites(itemId: string) {
  const user = await currentUser();
  if (!user) return null;

  const useritem = await db.user.findUnique({
    where: { id: user.id },
  });

  const updatedItems =
    useritem?.sidebarItems.filter((id) => id !== itemId) || [];

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      sidebarItems: updatedItems,
    },
  });

  return updatedUser.sidebarItems;
}

export async function getFavorites() {
  const useritem = await currentUser();
  if (!useritem?.email) return [];

  const user = await db.user.findUnique({
    where: { id: useritem.id },
  });

  return user?.sidebarItems || [];
}
