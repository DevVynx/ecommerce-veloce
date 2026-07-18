"use client";

import { useEffect, useState } from "react";

import { Input } from "@/shared/components/shadcn-ui/input";
import { formatPrice } from "@/shared/utils/store/price";

type CurrencyInputProps = {
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function CurrencyInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (value == null || Number.isNaN(value)) {
      setDisplay("");
    } else {
      setDisplay(formatPrice(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");

    if (!digits) {
      setDisplay("");
      onChange(undefined);
      return;
    }

    const reais = parseInt(digits, 10) / 100;
    setDisplay(formatPrice(reais));
    onChange(reais);
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
}
