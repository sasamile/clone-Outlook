"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { File, Mail } from "lucide-react";
import { useNewMailStore, useUploadthing } from "@/hooks/new-mail-state";
import { useSession } from "next-auth/react";
import { createDraftEmail } from "@/actions/mailfrom";
import FormUploadthing from "../Mail/uploadthing-form";
import { EmailActionsDropdown } from "../Mail/email-actions-dropdown";

function TrigerOpenSidebar() {
  const { data: session } = useSession();
  const { setNewMail, setDraftId } = useNewMailStore();
  const { setisUploadthingOpen } = useUploadthing();
  const isNewMail = useNewMailStore((state) => state.isNewMailOpen);

  const handleNewEmail = async () => {
    if (session?.user?.id) {
      const draft = await createDraftEmail(session.user.id);
      setDraftId(draft.id);
      setNewMail(true);
    }
  };
  return (
    <div>
      <div className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Button
            className="bg-blue-500 hover:bg-blue-300"
            onClick={handleNewEmail}
          >
            <Mail />
            Correo nuevo
          </Button>
          <EmailActionsDropdown />

          {isNewMail && (
            <Button
              className="bg-sidebar hover:bg-muted text-white"
              onClick={() => setisUploadthingOpen(true)}
            >
              <File />
            </Button>
          )}
        </div>
      </div>
       <FormUploadthing />
    </div>
  );
}

export default TrigerOpenSidebar;
