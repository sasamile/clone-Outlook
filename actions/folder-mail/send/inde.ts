"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { EmailResponse, FolderSendMailResponse } from "@/types";

export const FolderSendMail = async (): Promise<FolderSendMailResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "User not found", status: 401 };
    }

    const res = await db.email.findMany({
      where: {
        AND: [
          { fromId: user.id },
          {
            userStates: {
              some: {
                userId: user.id,
                folder: "sent",
              },
            },
          },
        ],
      },
      include: {
        userStates: {
          include: {
            user: true,
          },
        },
        from: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attachments: true,
        ccRecipients: {
          include: {
            user: true,
          },
        },
        toRecipients: {
          include: {
            user: true,
          },
        },
        forwardedTo: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedFrom: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    return res as EmailResponse[];
  } catch (error) {
    console.error("Error fetching sent emails:", error);
    throw new Error("Failed to fetch sent emails");
  }
};

export const FolderInboxMail = async (): Promise<FolderSendMailResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "User not found", status: 401 };
    }

    const res = await db.email.findMany({
      where: {
        AND: [
          // Buscar emails donde el usuario tenga un estado y esté en inbox
          {
            userStates: {
              some: {
                userId: user.id,
                folder: "inbox",
              },
            },
          },
          // Excluir emails donde el usuario es el remitente
          {
            NOT: {
              fromId: user.id,
            },
          },
        ],
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            createdAt: true,
          },
        },
        userStates: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            isRead: true,
            readAt: true,
            starred: true,
            folder: true,
          },
        },
        toRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        ccRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedTo: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedFrom: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return res as EmailResponse[];
  } catch (error) {
    console.error("Error retrieving inbox emails:", error);
    throw new Error("Failed to retrieve inbox emails");
  }
};

// Función helper para incluir las relaciones comunes

// Borradores
export const FolderDraftsMail = async (): Promise<FolderSendMailResponse> => {
  try {
    const user = await currentUser();
    if (!user) return { error: "User not found", status: 401 };

    const res = await db.email.findMany({
      where: {
        userStates: {
          some: {
            userId: user.id,
            folder: "drafts",
          },
        },
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            createdAt: true,
          },
        },
        userStates: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            isRead: true,
            readAt: true,
            starred: true,
            folder: true,
          },
        },
        toRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        ccRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedTo: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedFrom: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return res as EmailResponse[];
  } catch (error) {
    console.error("Error fetching drafts:", error);
    throw new Error("Failed to fetch drafts");
  }
};

// Destacados
export const FolderStarredMail = async (): Promise<FolderSendMailResponse> => {
  try {
    const user = await currentUser();
    if (!user) return { error: "User not found", status: 401 };

    const res = await db.email.findMany({
      where: {
        userStates: {
          some: {
            userId: user.id,
            folder: "starred",
          },
        },
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            createdAt: true,
          },
        },
        userStates: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            isRead: true,
            readAt: true,
            starred: true,
            folder: true,
          },
        },
        toRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        ccRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedTo: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedFrom: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return res as EmailResponse[];
  } catch (error) {
    console.error("Error fetching starred emails:", error);
    throw new Error("Failed to fetch starred emails");
  }
};

// Papelera
export const FolderTrashMail = async (): Promise<FolderSendMailResponse> => {
  try {
    const user = await currentUser();
    if (!user) return { error: "User not found", status: 401 };

    const res = await db.email.findMany({
      where: {
        userStates: {
          some: {
            userId: user.id,
            folder: "trash",
          },
        },
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            createdAt: true,
          },
        },
        userStates: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            isRead: true,
            readAt: true,
            starred: true,
            folder: true,
          },
        },
        toRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        ccRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedTo: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedFrom: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return res as EmailResponse[];
  } catch (error) {
    console.error("Error fetching trash:", error);
    throw new Error("Failed to fetch trash");
  }
};

// Archivados
export const FolderArchivedMail = async (): Promise<FolderSendMailResponse> => {
  try {
    const user = await currentUser();
    if (!user) return { error: "User not found", status: 401 };

    const res = await db.email.findMany({
      where: {
        userStates: {
          some: {
            userId: user.id,
            folder: "archive",
          },
        },
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            createdAt: true,
          },
        },
        userStates: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            isRead: true,
            readAt: true,
            starred: true,
            folder: true,
          },
        },
        toRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        ccRecipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedTo: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        forwardedFrom: {
          select: {
            id: true,
            subject: true,
            body: true,
            date: true,
            fromId: true,
            from: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return res as EmailResponse[];
  } catch (error) {
    console.error("Error fetching archived emails:", error);
    throw new Error("Failed to fetch archived emails");
  }
};
