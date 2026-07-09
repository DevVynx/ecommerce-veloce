"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserProfile } from "@repo/types/contracts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Field, FieldContent, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import { useAuthState } from "@/shared/states/auth";

import { updateProfile } from "../../actions/user/updateProfile";
import { showNotification } from "../showNotification";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type PersonalInfoFormProps = {
  user: UserProfile;
};

export const PersonalInfoForm = ({ user }: PersonalInfoFormProps) => {
  const { setUser } = useAuthState();
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email },
  });
  const { errors } = form.formState;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const values = form.getValues();
    const { data, error } = await updateProfile(values);
    if (data) {
      setUser(data.user);
      showNotification({
        type: "success",
        title: "Perfil atualizado!",
        message: "Suas informações pessoais foram salvas.",
      });
    } else if (error) {
      showNotification({
        type: "error",
        title: "Erro ao atualizar perfil.",
        message: typeof error.message === "string" ? error.message : "Tente novamente mais tarde.",
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Informações Pessoais</h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Gerencie suas informações pessoais e endereços.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Nome</FieldLabel>
            <FieldContent>
              <Input {...form.register("name")} />
              {errors.name && (
                <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>
              )}
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>E-mail</FieldLabel>
            <FieldContent>
              <Input type="email" {...form.register("email")} />
              {errors.email && (
                <p className="text-destructive mt-1 text-xs">{errors.email.message}</p>
              )}
            </FieldContent>
          </Field>
        </div>
        <Button type="submit" disabled={isSaving} className="cursor-pointer self-end">
          Salvar alterações
        </Button>
      </form>
    </div>
  );
};
