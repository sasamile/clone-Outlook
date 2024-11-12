"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Router } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginFormSchema } from "@/schemas/auth";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { PasswordInput } from "@/components/auth/password-input";
import { login } from "@/actions/auth";
import { FormStateMessage } from "./form-state-message";
import { toast } from "sonner";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correo ya está en uso con otra cuenta!"
      : "";

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setError("");
    setSuccess("");

    try {
      const response = await login(values);

      if (response?.error) {
        setError(response.error);
      } else {
        router.push(DEFAULT_LOGIN_REDIRECT);
        window.location.reload(); // Esto forzará una actualización completa
      }

      if (!response?.error) {
        form.reset();
      }
    } catch {
      toast.error("Ocurrió un problema con tu solicitud.");
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center w-full">
      <FormWrapper
        headerTitle="Bienvenido a CorrtMail"
        headerSubtitle="Introduzca su correo y contraseña para acceder a su cuenta"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 mt-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        type="email"
                        placeholder="ej. jhon@gmail.com"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className="h-12"
                        variant="largeRounded"
                        field={field}
                        isSubmitting={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormStateMessage type="Success" message={success} />
              <FormStateMessage type="Error" message={error || urlError} />

              <div className="pt-3 pb-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full font-semibold rounded-lg"
                >
                  {isSubmitting && (
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  )}
                  Iniciar sesión
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </FormWrapper>
    </div>
  );
}
