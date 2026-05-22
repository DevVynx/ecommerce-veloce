"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { register } from "@/shared/actions/auth/register";
import { ErrorNotification } from "@/shared/components/ErrorNotification";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Spinner } from "@/shared/components/shadcn-ui/spinner";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrev,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/shared/components/shadcn-ui/stepper";
import {
  type RegisterFormData,
  registerSchema,
  registerSteps,
} from "@/shared/schemas/auth/registerForm";
import { useAuthState } from "@/shared/states/auth";

import { Step1Identification } from "./Steps/Step1Identification";
import { Step2Security } from "./Steps/Step2Security";

type RegisterFormProps = {
  redirectTo?: string;
};

export const RegisterForm = ({ redirectTo = "/" }: RegisterFormProps) => {
  const [step, setStep] = useState("account");
  const { setUser, authError, setAuthError } = useAuthState();
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: {
        password: "",
        confirmPassword: "",
      },
    },
    mode: "onTouched",
  });

  const stepIndex = useMemo(() => registerSteps.findIndex((s) => s.value === step), [step]);

  const onValidate: NonNullable<StepperProps["onValidate"]> = useCallback(
    async (_value, direction) => {
      if (direction === "prev") return true;

      const stepData = registerSteps.find((s) => s.value === step);
      if (!stepData) return true;

      const isValid = await form.trigger(stepData.fields);

      if (!isValid) setAuthError("Preencha todos os campos antes de prosseguir");

      return isValid;
    },
    [form, step]
  );

  const onSubmit = async ({ name, email, password: p }: RegisterFormData) => {
    const { data, error } = await register({
      name,
      email,
      password: p.password,
      confirmPassword: p.confirmPassword,
    });

    if (error) {
      const displayMessage =
        typeof error.message === "string" ? error.message : "Dados inválidos. Verifique os campos.";
      setAuthError(displayMessage);
      return;
    }

    if (data) {
      setUser(data.user);
      setStep("account");
      form.reset();
      router.push(redirectTo);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (step === "account") {
      const stepData = registerSteps.find((s) => s.value === step);
      if (!stepData) return;
      const isValid = await form.trigger(stepData.fields);
      if (!isValid) {
        setAuthError("Preencha todos os campos antes de prosseguir");
        return;
      }
      setStep("security");
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="flex w-full flex-col gap-4">
        <Stepper value={step} onValueChange={setStep} onValidate={onValidate}>
          <StepperList>
            {registerSteps.map((stepItem) => (
              <StepperItem key={stepItem.value} value={stepItem.value}>
                <StepperTrigger>
                  <StepperIndicator />
                  <div className="flex flex-col gap-1">
                    <StepperTitle>{stepItem.title}</StepperTitle>
                    <StepperDescription>{stepItem.description}</StepperDescription>
                  </div>
                </StepperTrigger>
                <StepperSeparator className="mx-4" />
              </StepperItem>
            ))}
          </StepperList>

          <StepperContent value="account">
            <Step1Identification register={form.register} errors={form.formState.errors} />
          </StepperContent>

          <StepperContent value="security">
            <Step2Security register={form.register} errors={form.formState.errors} />
          </StepperContent>

          <div className="mx-auto mt-5 flex w-full max-w-lg gap-4">
            <StepperPrev asChild>
              <Button
                variant="outline"
                disabled={stepIndex === 0}
                className="w-full flex-1 cursor-pointer rounded-lg py-4 font-bold"
              >
                Voltar
              </Button>
            </StepperPrev>

            {stepIndex === registerSteps.length - 1 ? (
              <Button
                type="submit"
                className="w-full flex-2 cursor-pointer rounded-lg py-4 font-bold transition-colors"
              >
                {form.formState.isSubmitting ? <Spinner className="size-5" /> : "Registrar"}
              </Button>
            ) : (
              <StepperNext asChild>
                <Button className="w-full flex-2 cursor-pointer rounded-lg py-4 font-bold transition-colors">
                  Continuar
                </Button>
              </StepperNext>
            )}
          </div>
        </Stepper>
      </form>

      {authError && (
        <ErrorNotification
          key={"error"}
          title={step === "account" ? "Erro ao prosseguir" : "Erro ao tentar criar conta"}
          message={authError}
          onCloseAction={() => setAuthError(null)}
          position="top-left"
        />
      )}
    </>
  );
};
