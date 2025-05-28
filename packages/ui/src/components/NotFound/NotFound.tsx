import { ReactNode } from "react";

import Heading from "../Heading";

interface NotFoundProps {
  headingMessage: string;
  children: ReactNode;
}

const NotFound = ({ headingMessage, children }: NotFoundProps) => {
  return (
    <div className="my-18 text-center" aria-live="polite">
      <Heading size="h4" className="mb-6 font-bold">
        {headingMessage}
      </Heading>
      {children}
    </div>
  );
};

export default NotFound;
