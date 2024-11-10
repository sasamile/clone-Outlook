import React from "react";
import { LargeLogo } from "../large-logo";

export default function InitialAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 h-full overflow-hidden">
      <div className="flex-1 relative max-lg:hidden flex items-end w-[520px] min-w-[500px] h-screen px-8 py-10 2xl:py-[100px] bg-gradient-to-b from-blue-700 via-blue-700/50 to-blue-900/20 inverted-border-radius">
        <LargeLogo dinamicColor={false} className="absolute top-8 left-8" />
        <div className="space-y-2 select-none">
          <h2 className="text-[60px] 2xl:text-[80px] font-semibold leading-[58px] 2xl:leading-[80px]  mb-7 2xl:mb-10">
            Correo <br /> Electrónico Seguro
          </h2>
          <p className="dark:text-muted-foreground text-black/75 md:text-lg 2xl:text-2xl w-[90%] xl:w-[70%]">
            Tu plataforma de correo electrónico segura y confiable. Mantén tus
            comunicaciones protegidas, organizadas y accesibles en cualquier
            momento y lugar.
          </p>
        </div>
      </div>
      <div className="flex-1 lg:py-8 max-lg:py-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
