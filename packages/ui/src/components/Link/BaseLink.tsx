import { AnchorHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  To,
} from "react-router";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

export interface BaseLinkProps
  extends Omit<RouterLinkProps, "to">,
    Omit<
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      "ref" | "href"
    > {
  href: To;
  external?: boolean;
  newTab?: boolean;
}

const BaseLink = forwardRef<HTMLAnchorElement, Omit<BaseLinkProps, "ref">>(
  ({ external, href, newTab, children, ...rest }, forwardedRef) => {
    // NOTE: Only expect strings so far
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const url = href ? sanitizeUrl(String(href)) : undefined;

    const commonProps = {
      ...rest,
      ...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    };

    if (external) {
      return (
        // NOTE: We do want to allow external links to be rendered as <a> tags
        // eslint-disable-next-line react/forbid-elements
        <a ref={forwardedRef} href={url ?? ""} {...commonProps}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink ref={forwardedRef} to={url ?? "#"} {...commonProps}>
        {children}
      </RouterLink>
    );
  },
);

export default BaseLink;
