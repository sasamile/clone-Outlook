"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Download,
  File,
  FileArchive,
  FileCode,
  FileImage,
  FileText,
  Film,
  Music,
} from "lucide-react";
import { EmailComment } from "@/types";
import { BsFileEarmarkPdfFill } from "react-icons/bs";

interface CommentCardProps {
  comment: EmailComment;
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes("image")) return <FileImage className="w-8 h-8" />;
  if (fileType.includes("pdf"))
    return <BsFileEarmarkPdfFill className="w-8 h-8" />;
  if (fileType.includes("video")) return <Film className="w-8 h-8" />;
  if (fileType.includes("audio")) return <Music className="w-8 h-8" />;
  if (fileType.includes("zip") || fileType.includes("rar"))
    return <FileArchive className="w-8 h-8" />;
  if (fileType.includes("msword") || fileType.includes("wordprocessingml"))
    return <FileText className="w-8 h-8" />;
  if (
    fileType.includes("code") ||
    fileType.includes("javascript") ||
    fileType.includes("json")
  )
    return <FileCode className="w-8 h-8" />;
  return <File className="w-8 h-8" />;
};

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <>
      <div className="border rounded-lg p-4  bg-gray-800/30">
        <Collapsible>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={comment.user.image ?? ""} />
                <AvatarFallback>
                  {comment.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-medium">{comment.user.name}</p>
                <p className="text-sm text-gray-400">{comment.subject}</p>
              </div>
              <p className="text-sm text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-4">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />

            {comment.attachments && comment.attachments.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Archivos adjuntos:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {comment.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-2 bg-gray-700/30 rounded"
                    >
                      {getFileIcon(file.type)}
                      <span className="text-sm flex-1 truncate">
                        {file.name}
                      </span>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
