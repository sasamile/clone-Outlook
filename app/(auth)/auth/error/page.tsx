import Link from "next/link"

import { LargeLogo } from "@/components/large-logo"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center">
        <LargeLogo className="lg:hidden mb-8 w-fit mx-auto" />
        <h2 className="md:text-3xl text-xl font-medium">
          Uh oh! Algo salió mal
        </h2>
        <p className="text-muted-foreground">
          Ocurrió algo inesperado en tu solicitud, por favor vuelve a intertarlo
        </p>
        <Link href="/auth">
          <Button className="mt-4">Volver</Button>
        </Link>
      </div>
    </div>
  )
}