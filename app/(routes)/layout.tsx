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
            <main className="px-4 overflow-hidden">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
