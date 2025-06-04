import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";

import { ListVariants } from "./styles";

interface ULProps
  extends ListVariants,
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {}

const Ul = forwardRef<HTMLUListElement, ULProps>(
  ({ className, unStyled, space, ...rest }, forwardedRef) => (
    <ul
      ref={forwardedRef}
      className={list({ type: "unordered", unStyled, space, class: className })}
      {...rest}
    />
  ),
);

export default Ul;
