"use client";
import Image from "next/image";
import {
  useMailStore,
  useNewMailStore,
  useUploadthing,
} from "@/hooks/new-mail-state";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NewEmail from "./new-email";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Download, File, MessageCircleCode } from "lucide-react";
import {
  AiFillFilePdf,
  AiFillFileImage,
  AiFillFileZip,
  AiFillFileWord,
  AiFillFileExcel,
  AiFillFilePpt,
  AiFillFile,
} from "react-icons/ai";
import { EmailResponse } from "@/types";
import { MessageSquare } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { createComment } from "@/actions/mailfrom/comment";
import { toast } from "sonner";
import { CommentForm } from "./comment-form";
import { CommentCard } from "./comment-card";
import { getEmailById } from "@/actions/user";

const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) {
    return <AiFillFilePdf className="h-8 w-8 text-red-500" />;
  }
  if (fileType.includes("image")) {
    return <AiFillFileImage className="h-8 w-8 text-blue-500" />;
  }
  if (fileType.includes("zip") || fileType.includes("rar")) {
    return <AiFillFileZip className="h-8 w-8 text-yellow-500" />;
  }
  if (fileType.includes("word") || fileType.includes("doc")) {
    return <AiFillFileWord className="h-8 w-8 text-blue-600" />;
  }
  if (fileType.includes("excel") || fileType.includes("sheet")) {
    return <AiFillFileExcel className="h-8 w-8 text-green-600" />;
  }
  if (fileType.includes("powerpoint") || fileType.includes("presentation")) {
    return <AiFillFilePpt className="h-8 w-8 text-orange-600" />;
  }
  return <AiFillFile className="h-8 w-8 text-gray-500" />;
};

export const EmailDetail = () => {
  const pathname = usePathname();
  const selectedEmail = useMailStore((state) => state.selectedEmail);
  const setSelectedEmail = useMailStore((state) => state.setSelectedEmail);
  const isNewMail = useNewMailStore((state) => state.isNewMailOpen);
  const [comments, setComments] = useState(selectedEmail?.comments || []);
  const [isOpen, setIsOpen] = useState(false);
  const { setisUploadthingOpen } = useUploadthing();

  useEffect(() => {
    setSelectedEmail(null);
  }, [pathname]);

  if (isNewMail) {
    return <NewEmail />;
  }

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDownloadAll = async () => {
    if (selectedEmail?.attachments && selectedEmail.attachments.length > 0) {
      for (const file of selectedEmail.attachments) {
        await handleDownload(file.url, file.name);
      }
    }
  };

  if (!selectedEmail) {
    return (
      <div className="text-gray-500 flex flex-col justify-center items-center h-[80vh]">
        <Image src={"/icons/dark.svg"} alt="dark" width={250} height={300} />
        <h3 className="text-white font-bold">
          Seleccionar un elemento para leerlo
        </h3>
        <p>No hay nada seleccionado</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col bg-sidebar rounded-xl">
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h3 className="pr-8 font-bold">{selectedEmail.subject}</h3>
            <button
              onClick={() => setSelectedEmail(null)}
              className="text-white"
            >
              ✕
            </button>
          </div>
          <div className="mb-4 flex items-center gap-4">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src={selectedEmail.from.image ?? undefined}
                alt={selectedEmail.from.name ?? ""}
              />
              <AvatarFallback className="rounded-lg">
                {selectedEmail.from.name
                  ? selectedEmail.from.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className=" text-gray-400">
                {selectedEmail.from.name} ({selectedEmail.from.email})
              </p>
              <p className="flex gap-3 items-center text-ms text-gray-400">
                Para:{" "}
                {selectedEmail.toRecipients.length > 1 ? (
                  <span className="flex items-center gap-1">
                    {selectedEmail.toRecipients[0].user.email}
                    <Popover>
                      <PopoverTrigger className="text-white hover:underline">
                        +{selectedEmail.toRecipients.length - 1} más
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            Destinatarios adicionales
                          </h4>
                          {selectedEmail.toRecipients
                            .slice(1)
                            .map((recipient, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-400"
                              >
                                {recipient.user.email}
                              </div>
                            ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </span>
                ) : (
                  selectedEmail.toRecipients[0]?.user.email
                )}
              </p>
            </div>
          </div>

          <div
            className="text-gray-50 leading-relaxed prose prose-invert max-w-none space-y-3  pt-4"
            dangerouslySetInnerHTML={{ __html: selectedEmail.body ?? "" }}
          />
        </div>

        {/* Attachments Grid */}
        {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
              {selectedEmail.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col items-center py-2 border rounded-lg hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="mb-2">
                    {file.type.includes("image") ? (
                      <div className="relative w-20 h-20">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-20 h-20">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>
                  <div className="w-full text-center space-y-2">
                    <p className="text-sm font-medium truncate max-w-[200px] px-2">
                      {file.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDownload(file.url, file.name)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {selectedEmail.attachments.length > 1 && (
              <div className="space-y-4 p-5">
                <Button
                  variant="outline"
                  onClick={handleDownloadAll}
                  className="mb-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Todo
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="px-6 my-8">
        <div className="flex justify-between items-center my-6">
          <h2 className="font-semibold text-xl">
            {isOpen ? "Comentar" : "Respuesta"}
          </h2>
          <div className="flex gap-3">
            {isOpen && (
              <Button
                onClick={() => setisUploadthingOpen(true)}
                variant={"ghost"}
                className="bg-blue-500 "
              >
                <File />
              </Button>
            )}

            <Button onClick={() => setIsOpen(!isOpen)}>
              <MessageCircleCode className="w-4 h-4" />
              {isOpen ? "Cancelar" : " Responder"}
            </Button>
          </div>
        </div>

        {isOpen ? (
          <CommentForm
          setIsOpen={setIsOpen}
            emailId={selectedEmail.id}
            onCommentCreated={async () => {
              // Refrescar el email seleccionado para obtener los nuevos comentarios
              const updatedEmail = await getEmailById(selectedEmail.id);
              if (updatedEmail) {
                useMailStore.getState().setSelectedEmail(updatedEmail);
              }
            }}
          />
        ) : (
          <div className="space-y-4">
            {selectedEmail.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
