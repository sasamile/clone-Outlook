"use client";

import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CompleteRegisterFormSchema } from "@/schemas/auth";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { FormStateMessage } from "@/components/auth/form-state-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entities } from "@/constants";
import { completeRegistration } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CompletionFormProps {
  user: { name: string; email: string; image: string };
}

export function CompletionForm({ user }: CompletionFormProps) {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof CompleteRegisterFormSchema>>({
    resolver: zodResolver(CompleteRegisterFormSchema),
    defaultValues: {
      name: user.name,
      Identity: "",
      entity: undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof CompleteRegisterFormSchema>) {
    setError("");
    setSuccess("");

    try {
      const response = await completeRegistration(values);

      if (response?.error) {
        setError(response?.error);
      }

      if (!response?.error) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Ocurrió un problema con tu solicitud.");
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center w-full">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Avatar className="size-[90px]">
          <AvatarImage src={user.image} alt="Imagen de Perfil" />
          <AvatarFallback>
            <User className="size-1/2" />
          </AvatarFallback>
        </Avatar>
        <FormWrapper
          headerTitle={`Bienvenido ${user.name}`}
          headerSubtitle="Culmina tu registro seleccionando la entidad a la que perteneces"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 mt-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jhon Doe"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Puedes modificar tu nombre si lo prefieres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="Identity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Identificacion</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12"
                          placeholder="1.111.222.333"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entidad *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl pl-4">
                            <SelectValue placeholder="Selecciona la entidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {entities.map((entity, i) => (
                            <SelectItem key={i} value={entity}>
                              {entity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecciona la entidad a la que estas vinculado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormStateMessage type="Success" message={success} />
                <FormStateMessage type="Error" message={error} />

                <div className="pt-3 pb-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !isValid}
                    className="w-full font-semibold rounded-lg"
                  >
                    {isSubmitting && (
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    )}
                    Continuar
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </FormWrapper>
      </div>
    </div>
  );
}
