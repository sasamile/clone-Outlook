// Tipo para la respuesta del action
export type FolderSendMailResponse = EmailResponse[] | { error: string; status: number };

export interface EmailResponse {
  id: string;
  subject: string | null;
  body: string | null;
  date: Date;
  fromId: string;
  from: EmailUser;
  userStates: EmailUserState[]; // Cambiado de UserEmailState a EmailUserState
  attachments: EmailAttachment[];
  toRecipients: EmailRecipient[];
  ccRecipients: EmailRecipient[];
  forwardedTo: ForwardedEmail[];
  forwardedFrom: ForwardedEmail | null;
  comments: EmailComment[];
}

// Interfaces simplificadas para la respuesta
export interface EmailUserState {
  id: string;
  isRead: boolean;
  readAt: Date | null;
  starred: boolean;
  folder: string;
}

export interface EmailUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface EmailAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: Date;
}

export interface EmailRecipient {
  id: string;
  userId: string;
  user: EmailUser;
}

export interface EmailComment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: EmailUser;
}

export interface ForwardedEmail {
  id: string;
  subject: string | null;
  body: string | null;
  date: Date;
  fromId: string;
  from: EmailUser;
}