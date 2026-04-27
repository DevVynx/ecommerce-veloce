"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginRequest } from "@repo/types/contracts";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { login } from "@/shared/actions/auth/login";
import { ErrorNotification } from "@/shared/components/ErrorNotification";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Checkbox } from "@/shared/components/shadcn-ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Label } from "@/shared/components/shadcn-ui/label";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import { type LoginFormData, loginSchema } from "@/shared/schemas/auth/loginForm";
import { useAuthState } from "@/shared/states/auth";

type LoginFormProps = {
  redirectTo?: string;
};

export const LoginForm = ({ redirectTo = "/" }: LoginFormProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const { setUser, authError, setAuthError } = useAuthState();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async ({ email, password }: LoginRequest) => {
    const { data, error } = await login({ email, password, rememberMe: checked });

    if (error) {
      const displayMessage =
        typeof error.message === "string" ? error.message : "Dados inválidos. Verifique os campos.";
      setAuthError(displayMessage);
      return;
    }

    if (data) {
      setUser(data.user);
      router.push(redirectTo);
    }
  };

  return (
    <>
      <form
        id="form-login"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FieldGroup className="gap-4">
          {/* CAMPO DE EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor="form-email">Email</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="form-email"
                    type="email"
                    placeholder="Digite o seu email"
                    aria-invalid={fieldState.invalid}
                    className={`bg-background text-foreground pl-10 ${fieldState.invalid && "border-destructive focus-visible:ring-destructive"}`}
                  />
                  <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                    <MailIcon className="size-5" />
                  </div>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* CAMPO DE SENHA */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor="form-password">Senha</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="form-password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Digite a sua senha"
                    aria-invalid={fieldState.invalid}
                    className={`bg-background text-foreground px-10 ${fieldState.invalid && "border-destructive focus-visible:ring-destructive"}`}
                  />
                  <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                    <LockIcon className="size-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-3 -translate-y-1/2 rounded-sm transition-colors focus:outline-none focus-visible:ring-2"
                    aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {isPasswordVisible ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeOffIcon className="size-5" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="mx-auto flex w-full max-w-lg items-center justify-between">
        <Field orientation="horizontal" className="text-card-foreground flex-1">
          <Checkbox
            id="remember-me-checkbox"
            checked={checked}
            onCheckedChange={(value) => setChecked(!!value)}
          />
          <Label htmlFor="remember-me-checkbox">Lembre-me</Label>
        </Field>

        <Link
          href="/register"
          className="text-card-foreground hover:text-muted-foreground text-sm font-bold underline"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        type="submit"
        form="form-login"
        disabled={form.formState.isSubmitting || !!authError}
        className="mx-auto mt-5 w-full max-w-lg cursor-pointer rounded-lg py-4 font-bold transition-colors"
      >
        {form.formState.isSubmitting ? <Spinner className="size-5" /> : "Entrar"}
      </Button>

      {authError && (
        <ErrorNotification
          key={"error"}
          title="Erro ao tentar fazer login"
          message={authError}
          onCloseAction={() => setAuthError(null)}
        />
      )}
    </>
  );
};
