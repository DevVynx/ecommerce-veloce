type QuantitySelectorProps = {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

export const QuantitySelector = ({ quantity, onDecrement, onIncrement }: QuantitySelectorProps) => {
  return (
    <div className="mt-5 flex items-center gap-2">
      <h1>Quantidade:</h1>
      <div className="flex items-center text-lg">
        <button onClick={onDecrement} className="cursor-pointer bg-black/10 px-3">
          -
        </button>
        <span className="h-full w-16 bg-zinc-100 text-center font-bold">{quantity}</span>
        <button onClick={onIncrement} className="cursor-pointer bg-black/10 px-3">
          +
        </button>
      </div>
    </div>
  );
};
