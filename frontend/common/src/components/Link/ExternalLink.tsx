import React from "react";
import { ExternalLinkIcon } from "@heroicons/react/outline";

export interface ExternalLinkProps
  extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  newTab?: boolean;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  newTab,
  children,
  ...rest
}) => {
  const ChildWrap = newTab ? "span" : React.Fragment;

  return (
    <a
      {...(newTab && {
        target: "_blank",
        "data-h2-display": "b(inline-flex)",
        "data-h2-align-items": "b(center)",
      })}
      {...rest}
    >
      <ChildWrap>{children}</ChildWrap>
      {newTab && (
        <ExternalLinkIcon
          style={{ height: "1em", marginLeft: "0.25rem", width: "1em" }}
        />
      )}
    </a>
  );
};

export default ExternalLink;
