import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import { addressFormSchema, type AddressFormValues } from "@/shared/schemas/address";
import { fetchAddressByCep } from "@/shared/utils/api/viacep";
import { formatCep } from "@/shared/utils/store/checkout/formatCep";

import { showNotification } from "../showNotification";

const DEFAULT_ADDRESS_VALUES: AddressFormValues = {
  receiverName: "",
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  complement: "",
  label: "",
};

type InlineAddressFormProps = {
  initialValues?: AddressFormValues;
  onSubmit: (data: AddressFormValues) => Promise<void>;
};

export const InlineAddressForm = ({ initialValues, onSubmit }: InlineAddressFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialValues ?? DEFAULT_ADDRESS_VALUES,
  });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length !== 8) return;

    setIsLoadingCep(true);
    const result = await fetchAddressByCep(raw);
    setIsLoadingCep(false);

    if (result) {
      setValue("street", result.street, { shouldValidate: true });
      setValue("neighborhood", result.neighborhood, { shouldValidate: true });
      setValue("city", result.city, { shouldValidate: true });
      setValue("state", result.state, { shouldValidate: true });
    } else {
      showNotification({
        type: "error",
        title: "CEP não encontrado.",
        message: "O CEP informado não foi encontrado. Verifique e tente novamente.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setIsSubmitting(true);
        await onSubmit(data);
        setIsSubmitting(false);
      })}
      className="bg-muted/20 mb-3 rounded-lg border p-4"
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel>Recebedor</FieldLabel>
            <FieldContent>
              <Input placeholder="Quem vai receber" {...register("receiverName")} />
              <FieldError>{errors.receiverName?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>CEP</FieldLabel>
            <FieldContent>
              <Input
                placeholder="00000-000"
                maxLength={9}
                {...register("cep")}
                onChange={(e) =>
                  setValue("cep", formatCep(e.target.value), { shouldValidate: true })
                }
                onBlur={handleCepBlur}
              />
              {isLoadingCep && <Spinner className="mt-1 size-3" />}
              <FieldError>{errors.cep?.message}</FieldError>
            </FieldContent>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Field>
              <FieldLabel>Rua</FieldLabel>
              <FieldContent>
                <Input placeholder="Nome da rua" {...register("street")} />
                <FieldError>{errors.street?.message}</FieldError>
              </FieldContent>
            </Field>
          </div>
          <Field>
            <FieldLabel>Número</FieldLabel>
            <FieldContent>
              <Input placeholder="123" {...register("number")} />
              <FieldError>{errors.number?.message}</FieldError>
            </FieldContent>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field>
            <FieldLabel>Bairro</FieldLabel>
            <FieldContent>
              <Input placeholder="Bairro" {...register("neighborhood")} />
              <FieldError>{errors.neighborhood?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Cidade</FieldLabel>
            <FieldContent>
              <Input placeholder="Cidade" {...register("city")} />
              <FieldError>{errors.city?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>UF</FieldLabel>
            <FieldContent>
              <Input placeholder="UF" maxLength={2} className="uppercase" {...register("state")} />
              <FieldError>{errors.state?.message}</FieldError>
            </FieldContent>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel>Complemento</FieldLabel>
            <FieldContent>
              <Input placeholder="Apto, Bloco, etc." {...register("complement")} />
              <FieldError>{errors.complement?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Identificação</FieldLabel>
            <FieldContent>
              <Input placeholder="Casa, Trabalho, etc." {...register("label")} />
              <FieldError>{errors.label?.message}</FieldError>
            </FieldContent>
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
};
