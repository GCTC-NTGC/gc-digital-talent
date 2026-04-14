import type { DetailedHTMLProps, OlHTMLAttributes } from "react";
import { forwardRef } from "react";

import type { ListVariants } from "./styles";
import { list } from "./styles";

interface OLProps
  extends
    ListVariants,
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
