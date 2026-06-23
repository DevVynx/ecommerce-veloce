import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Checkbox } from "@/shared/components/shadcn-ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/shared/components/shadcn-ui/field";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import { addressFormSchema, type AddressFormValues } from "@/shared/schemas/checkout/address";
import { fetchAddressByCep } from "@/shared/utils/api/viacep";
import { formatCep } from "@/shared/utils/store/checkout/formatCep";

type AddressFormProps = {
  onSubmit: (data: AddressFormValues, saveAddress: boolean) => Promise<void>;
  onPrevious?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export const AddressForm = ({
  onSubmit,
  onPrevious,
  isSubmitting = false,
  submitLabel = "Continuar",
}: AddressFormProps) => {
  const [saveAddress, setSaveAddress] = useState(true);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      receiverName: "",
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      complement: "",
      label: "",
    },
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
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, saveAddress))}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel>Nome do recebedor</FieldLabel>
        <FieldContent>
          <Input
            placeholder="Quem vai receber"
            className="bg-muted/30"
            {...register("receiverName")}
          />
          <FieldError>{errors.receiverName?.message}</FieldError>
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>CEP</FieldLabel>
          <FieldContent>
            <Input
              placeholder="00000-000"
              maxLength={9}
              className="bg-muted/30"
              {...register("cep")}
              onChange={(e) => {
                const formatted = formatCep(e.target.value);
                setValue("cep", formatted, { shouldValidate: true });
              }}
              onBlur={handleCepBlur}
            />
            {isLoadingCep && <Spinner className="mt-1 size-3" />}
            <FieldError>{errors.cep?.message}</FieldError>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Identificador (opcional)</FieldLabel>
          <FieldContent>
            <Input placeholder="Casa, Trabalho..." className="bg-muted/30" {...register("label")} />
            <FieldError>{errors.label?.message}</FieldError>
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <Field>
            <FieldLabel>Rua</FieldLabel>
            <FieldContent>
              <Input placeholder="Nome da rua" className="bg-muted/30" {...register("street")} />
              <FieldError>{errors.street?.message}</FieldError>
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Número</FieldLabel>
          <FieldContent>
            <Input placeholder="123" className="bg-muted/30" {...register("number")} />
            <FieldError>{errors.number?.message}</FieldError>
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel>Bairro</FieldLabel>
          <FieldContent>
            <Input placeholder="Bairro" className="bg-muted/30" {...register("neighborhood")} />
            <FieldError>{errors.neighborhood?.message}</FieldError>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Cidade</FieldLabel>
          <FieldContent>
            <Input placeholder="Cidade" className="bg-muted/30" {...register("city")} />
            <FieldError>{errors.city?.message}</FieldError>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Estado</FieldLabel>
          <FieldContent>
            <Input
              placeholder="UF"
              maxLength={2}
              className="bg-muted/30 uppercase"
              {...register("state")}
            />
            <FieldError>{errors.state?.message}</FieldError>
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Complemento (opcional)</FieldLabel>
        <FieldContent>
          <Input placeholder="Apto, Bloco..." className="bg-muted/30" {...register("complement")} />
          <FieldError>{errors.complement?.message}</FieldError>
        </FieldContent>
      </Field>

      <div className="flex items-center gap-2">
        <Checkbox
          id="saveAddress"
          checked={saveAddress}
          onCheckedChange={(checked) => setSaveAddress(checked === true)}
        />
        <label
          htmlFor="saveAddress"
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Salvar esse endereço para as próximas compras
        </label>
      </div>

      <div className="flex flex-1 flex-col-reverse items-center justify-between gap-5 pt-2 sm:flex-row">
        {onPrevious && (
          <Button
            type="button"
            variant="outline"
            className="border-primary/30 w-full cursor-pointer px-6 py-3 sm:w-auto"
            onClick={onPrevious}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer py-3 sm:w-60"
        >
          {isSubmitting ? <Spinner className="size-4" /> : null}
          {submitLabel}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
};
