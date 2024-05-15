import { useFormContext } from "react-hook-form";

export type HiddenInputProps = {
  name: string;
};

const HiddenInput = ({ name }: HiddenInputProps) => {
  const { register } = useFormContext();

  return <input type="hidden" {...register(name)} />;
};

export default HiddenInput;
