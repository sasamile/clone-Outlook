"use client";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-from";
import { LargeLogo } from "@/components/large-logo";
import { Loader } from "lucide-react";
import { Suspense, useState } from "react";

export default function AuthPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const changeFormLabel = isLoggingIn
    ? "No tienes una cuenta?"
    : "Ya tienes una cuenta?";
  const changeFormTrigger = isLoggingIn ? "Regístrate" : "Inicia sesión";

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-6 min-h-full overflow-hidden">
      <LargeLogo className="lg:hidden" />

      <Suspense fallback={<Loader />}>
        {isLoggingIn && <LoginForm />}
        {!isLoggingIn && <RegisterForm />}
      </Suspense>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground select-none">
          {changeFormLabel}
        </span>
        <button
          className="font-medium select-none"
          onClick={() => setIsLoggingIn(!isLoggingIn)}
        >
          {changeFormTrigger}
        </button>
      </div>
    </div>
  );
}
