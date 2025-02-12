import { HTMLProps } from "react";

type CardFormProps = HTMLProps<HTMLDivElement>;

const CardForm = (props: CardFormProps) => (
  <div
    data-h2-background-color="base(foreground)"
    data-h2-padding="base(x1) l-tablet(x1.5)"
    data-h2-radius="base(rounded)"
    data-h2-shadow="base(larger)"
    {...props}
  />
);

export default CardForm;
