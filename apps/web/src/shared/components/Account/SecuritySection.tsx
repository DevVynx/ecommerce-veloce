"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { changePassword } from "@/shared/actions/user/changePassword";
import { deleteAccount } from "@/shared/actions/user/deleteAccount";
import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/shadcn-ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import {
  type ChangePasswordFormValues,
  changePasswordSchema,
} from "@/shared/schemas/changePassword";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";
import { clearAllStorages } from "@/shared/utils/store/state/clearAllStorages";

import { showNotification } from "../showNotification";

export const SecuritySection = () => {
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    setIsSavingPassword(true);
    const { error } = await authenticatedAction(changePassword, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    setIsSavingPassword(false);
    if (error) {
      showNotification({
        type: "error",
        title: "Erro ao alterar senha.",
        message:
          typeof error.message === "string"
            ? error.message
            : "Verifique se a senha atual está correta e tente novamente.",
      });
      return;
    }
    showNotification({
      type: "success",
      title: "Senha alterada com sucesso!",
      message: "Sua senha foi alterada com sucesso.",
    });
    reset();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const { error } = await authenticatedAction(deleteAccount);
    setIsDeleting(false);
    if (error) {
      showNotification({
        type: "error",
        title: "Erro ao excluir conta.",
        message:
          typeof error.message === "string"
            ? error.message
            : "Não foi possível excluir sua conta. Tente novamente mais tarde.",
      });
      return;
    }
    clearAllStorages();
    const { logout } = await import("@/shared/actions/auth/logout");
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Privacidade e Segurança</h2>

      <form onSubmit={handleSubmit(handleChangePassword)} className="mb-6 flex flex-col gap-4">
        <p className="text-sm font-medium">Alterar senha</p>
        <p className="text-muted-foreground text-xs">
          Mantenha sua conta segura alterando sua senha regularmente
        </p>
        <Field>
          <FieldLabel>Senha atual</FieldLabel>
          <FieldContent>
            <Input type="password" {...register("currentPassword")} />
            <FieldError>{errors.currentPassword?.message}</FieldError>
          </FieldContent>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Nova senha</FieldLabel>
            <FieldContent>
              <Input type="password" {...register("newPassword")} />
              <FieldError>{errors.newPassword?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Confirmar senha</FieldLabel>
            <FieldContent>
              <Input type="password" {...register("confirmPassword")} />
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </FieldContent>
          </Field>
        </div>
        <Button type="submit" disabled={isSavingPassword} className="w-fit cursor-pointer">
          Alterar senha
        </Button>
      </form>

      <Separator className="mb-6" />

      <div>
        <p className="mb-1 text-sm font-medium">Excluir conta</p>
        <p className="text-muted-foreground mb-3 text-xs">
          Apague permanentemente sua conta e todos os dados
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer">
              <Trash2 className="mr-1 size-4" />
              Excluir conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir conta</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-2 text-sm">
                Digite <strong>confirmar</strong> abaixo para prosseguir.
              </p>
              <Input
                placeholder='Digite "confirmar"'
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={isDeleting || confirmEmail !== "confirmar"}
                className="cursor-pointer"
                onClick={handleDeleteAccount}
              >
                {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
