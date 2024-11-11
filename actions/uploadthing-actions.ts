"use server"

import { formatImageUrl } from "@/lib/format-url";
import { utapi } from "./uploadthing";

export async function deleteImageFile(imageUrl: string) {
  try {
    const newImageUrl = formatImageUrl(imageUrl);
    const response = await utapi.deleteFiles(newImageUrl);
    return response.success; // Simplificamos el retorno
  } catch (error) {
    console.log(error);
    return false; // Retornamos false en caso de error
  }
}
