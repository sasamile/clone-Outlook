import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo válido" })
    .trim(),
  password: z
    .string()
    .min(1, {
      message: "La contraseña debe contener al menos un carácter",
    })
    .trim(),
});

export const RegisterFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "El nombre debe tener por lo menos 2 caracteres" })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "El apellido debe tener por lo menos 2 caracteres" })
    .trim(),
  Identity: z
    .string()
    .min(10, {
      message: "El numero de Identidad debe tener por los menos 10 caracteres",
    })
    .trim(),
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo válido" })
    .trim(),
  entity: z.enum(["Piedemonte", "Cliente"], {
    required_error: "Debes seleccionar la entidad a la que estas vinculado",
  }),
  password: z
    .string()
    .min(8, { message: "Debe tener al menos 8 caracteres" })
    .regex(/[a-zA-Z]/, { message: "Debe contener por lo menos 1 letra" })
    .regex(/[0-9]/, { message: "Debe contener al menos 1 numero" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos 1 caracterer especial",
    })
    .trim(),
});

export const CompleteRegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener por lo menos 2 caracteres" })
    .trim(),
  Identity: z
    .string()
    .min(10, {
      message: "El numero de Identidad debe tener por los menos 10 caracteres",
    })
    .trim(),
  entity: z.enum(["Piedemonte", "Cliente"], {
    required_error: "Debes seleccionar la entidad a la que estas vinculado",
  }),
});
