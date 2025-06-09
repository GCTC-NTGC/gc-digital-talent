import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";

import { list, ListVariants } from "./styles";

interface ULProps
  extends ListVariants,
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {}

const Ul = forwardRef<HTMLUListElement, ULProps>(
  ({ className, unStyled, space, inside, noIndent, ...rest }, forwardedRef) => (
    <ul
      ref={forwardedRef}
      className={list({
        type: "unordered",
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

export default Ul;
