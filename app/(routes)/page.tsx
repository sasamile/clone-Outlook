"use client";

import { EmailDetail } from "@/components/DetailEmail";
import EmailPruebas, { emailsData } from "@/components/EmailRoute";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import React, { useState } from "react";

function page() {
  const [selectedEmail, setSelectedEmail] = useState<
    (typeof emailsData)[0] | null
  >(null);
  return (
    <div className="flex  gap-2">
      <div className=" bg-sidebar rounded-md w-2/5 overflow-y-auto h-screen">
        <div className="py-4 flex justify-between items-center px-4">
          <h2 className="font-semibold ml-12">Bandeja de entrada</h2>
          <Filter className="w-4 h-4" />
        </div>
        <Separator />
        <EmailPruebas
          selectedEmail={selectedEmail}
          setSelectedEmail={setSelectedEmail}
        />
      </div>

      <div className="bg-sidebar w-3/5  overflow-hidden h-screen">
        <EmailDetail
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      </div>
    </div>
  );
}

export default page;
