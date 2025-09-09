import { useFormContext } from "react-hook-form";

import { CommonInputProps } from "../../types";

export interface HiddenInputProps extends Pick<CommonInputProps, "rules"> {
  name: string;
}

const HiddenInput = ({ name, rules = {} }: HiddenInputProps) => {
  const { register } = useFormContext();

  return <input type="hidden" {...register(name, rules)} />;
};

export default HiddenInput;
