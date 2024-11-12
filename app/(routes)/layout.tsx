import * as React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { currentUser } from "@/lib/auth-user";
import { getUserById } from "@/actions/user";
import InitialAuthLayout from "@/components/auth/initial-auth-layout";
import { CompletionForm } from "@/components/auth/completion-form";
import { useNewMailStore } from "@/hooks/new-mail-state";
import TrigerOpenSidebar from "@/components/sidebar/triger-open-sidebar";
import { EmailDetail } from "@/components/Mail/detail-mail";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function LayuotPages({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedUser = await currentUser();
  const existingUser = await getUserById(loggedUser?.id);

  const missingEntityRelation =
    !existingUser?.entity && !existingUser?.Identity;

  const initialData: { name: string; email: string; image: string } = {
    name: existingUser?.name!,
    email: existingUser?.email!,
    image: existingUser?.image!,
  };

  return (
    <>
      {missingEntityRelation && (
        <InitialAuthLayout>
          <CompletionForm user={initialData} />
        </InitialAuthLayout>
      )}

      {!missingEntityRelation && (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TrigerOpenSidebar />
            <div className="flex gap-2">
              <div className="px-4 w-2/5">
                <ScrollArea className="h-full">{children}</ScrollArea>
              </div>
              <div className="bg-sidebar w-3/5 mr-8  rounded-xl">
                <ScrollArea className="h-full">
                  <EmailDetail />
                </ScrollArea>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
