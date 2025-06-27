import { useEffect, useRef } from "react";

import { Heading, HeadingProps, HeadingRef } from "@gc-digital-talent/ui";

interface SubHeadingProps extends HeadingProps {
  preventAutoFocus?: boolean;
}

const SubHeading = ({ preventAutoFocus, ...rest }: SubHeadingProps) => {
  const headingRef = useRef<HeadingRef>(null);

  useEffect(() => {
    if (headingRef.current && !preventAutoFocus) {
      // Focus heading and scroll to top
      headingRef.current.focus({ preventScroll: false });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
