/* eslint-disable import/prefer-default-export */
import React from "react";

import { Link } from "@gc-digital-talent/ui";

export function buildExternalLink(
  href: string,
  chunks: React.ReactNode,
): React.ReactElement {
  return (
    <Link href={href} external>
      {chunks}
    </Link>
  );
}
