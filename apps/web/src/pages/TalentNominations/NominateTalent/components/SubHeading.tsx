import { useRef } from "react";

import { Heading, HeadingProps, HeadingRef } from "@gc-digital-talent/ui";

import useScrollToOnMount from "~/hooks/useScrollToOnMount";

interface SubHeadingProps extends HeadingProps {
  preventAutoFocus?: boolean;
}

const SubHeading = ({ preventAutoFocus, ...rest }: SubHeadingProps) => {
  const headingRef = useRef<HeadingRef>(null);
  useScrollToOnMount(headingRef.current, {
    top: 0,
    left: 0,
    behavior: "instant",
    preventAutoFocus,
  });

  return (
    <Heading
      ref={headingRef}
      level="h2"
      color="secondary"
      className="mt-0 font-normal"
      {...rest}
    />
  );
};

export default SubHeading;
