import { DetailedHTMLProps, forwardRef, OlHTMLAttributes } from "react";

import { list, ListVariants } from "./styles";

interface OLProps
  extends ListVariants,
    DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement> {}

const Ol = forwardRef<HTMLOListElement, OLProps>(
  ({ className, unStyled, space, inside, noIndent, ...rest }, forwardedRef) => (
    <ol
      ref={forwardedRef}
      className={list({
        type: "ordered",
        unStyled,
        space,
        inside,
        noIndent,
        class: className,
      })}
      {...rest}
    />
  ),
);

export default Ol;
