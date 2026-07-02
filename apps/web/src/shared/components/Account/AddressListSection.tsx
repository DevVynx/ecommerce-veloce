"use client";
import type { AddressDto } from "@repo/types/contracts";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { createAddress } from "@/shared/actions/user/createAddress";
import { deleteAddress } from "@/shared/actions/user/deleteAddress";
import { listAddresses } from "@/shared/actions/user/listAddresses";
import { setDefault } from "@/shared/actions/user/setDefault";
import { updateAddress } from "@/shared/actions/user/updateAddress";
import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn-ui/dialog";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import type { AddressFormValues } from "@/shared/schemas/address";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";
import { formatCep } from "@/shared/utils/store/checkout/formatCep";

import { showNotification } from "../showNotification";
import { AddressCard } from "./AddressCard";
import { InlineAddressForm } from "./InlineAddressForm";

export const AddressListSection = () => {
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<AddressDto | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data } = await authenticatedAction(listAddresses);
      if (data) setAddresses(data.addresses);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await authenticatedAction(deleteAddress, id);
    if (!error) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showNotification({
        type: "success",
        title: "Endereço removido.",
        message: "O endereço foi excluído da sua conta.",
      });
    } else {
      showNotification({
        type: "error",
        title: "Erro ao remover endereço.",
        message: typeof error?.message === "string" ? error.message : "Tente novamente.",
      });
    }
  };

  const handleAdd = async (data: AddressFormValues) => {
    const { data: result, error } = await authenticatedAction(createAddress, {
      receiverName: data.receiverName,
      label: data.label || undefined,
      cep: data.cep.replace(/\D/g, ""),
      street: data.street,
      number: data.number,
      complement: data.complement || undefined,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    });
    if (result) {
      setAddresses((prev) => [...prev, result.address]);
      setIsAddingNew(false);
      showNotification({
        type: "success",
        title: "Endereço adicionado!",
        message: "O novo endereço foi salvo na sua conta.",
      });
    } else {
      showNotification({
        type: "error",
        title: "Erro ao adicionar endereço.",
        message:
          typeof error?.message === "string"
            ? error.message
            : "Verifique os dados e tente novamente.",
      });
    }
  };

  const handleEdit = async (id: string, data: AddressFormValues) => {
    const { data: result, error } = await authenticatedAction(updateAddress, id, {
      receiverName: data.receiverName,
      label: data.label || undefined,
      cep: data.cep.replace(/\D/g, ""),
      street: data.street,
      number: data.number,
      complement: data.complement || undefined,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    });
    if (result) {
      setAddresses((prev) => prev.map((a) => (a.id === id ? result.address : a)));
      setEditingAddress(null);
      showNotification({
        type: "success",
        title: "Endereço atualizado!",
        message: "As alterações foram salvas.",
      });
    } else {
      showNotification({
        type: "error",
        title: "Erro ao atualizar endereço.",
        message: typeof error?.message === "string" ? error.message : "Tente novamente mais tarde.",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    const { data: result, error } = await authenticatedAction(setDefault, id);
    if (result) {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === result.address.id,
        }))
      );
      showNotification({
        type: "success",
        title: "Endereço definido como padrão!",
        message: "Este endereço será selecionado automaticamente nos pedidos.",
      });
    } else {
      showNotification({
        type: "error",
        title: "Erro ao definir endereço padrão.",
        message: typeof error?.message === "string" ? error.message : "Tente novamente mais tarde.",
      });
    }
  };

  const AddIcon = isAddingNew ? X : Plus;

  return (
    <div className="rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Endereços</h2>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => setIsAddingNew((prev) => !prev)}
        >
          <AddIcon className="mr-1 size-4" />
          {isAddingNew ? "Fechar" : "Adicionar"}
        </Button>
      </div>

      {isAddingNew && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <InlineAddressForm onSubmit={handleAdd} />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum endereço salvo.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id}>
              <AddressCard
                address={addr}
                onEdit={setEditingAddress}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={!!editingAddress}
        onOpenChange={(open) => {
          if (!open) setEditingAddress(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Endereço</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <InlineAddressForm
              initialValues={{
                receiverName: editingAddress.receiverName,
                cep: formatCep(editingAddress.cep),
                street: editingAddress.street,
                number: editingAddress.number,
                complement: editingAddress.complement ?? "",
                neighborhood: editingAddress.neighborhood,
                city: editingAddress.city,
                state: editingAddress.state,
                label: editingAddress.label ?? "",
              }}
              onSubmit={(data) => handleEdit(editingAddress.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
