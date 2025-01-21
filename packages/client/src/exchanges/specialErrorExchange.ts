import { pipe, tap } from "wonka";
import type { Exchange } from "@urql/core";
import { IntlShape } from "react-intl";

import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";

// A custom exchange that watches for special errors that are meaningful to us and need special handling.
const specialErrorExchange = ({ intl }: { intl: IntlShape }) => {
  const exchange: Exchange =
    ({ forward }) =>
    (ops$) =>
      pipe(
        ops$,
        // eslint-disable-next-line no-console
        // tap((op) => console.log("[Exchange debug]: Incoming operation: ", op)),
        forward,
        tap((result) => {
          const err = result.error;
          if (err) {
            const errRes = err.response as Response;
            // I think this is old error condition from when the firewall responded directly when blocking
            if (
              errRes?.status === 403 &&
              err?.networkError?.message?.includes("Request Rejected")
            ) {
              toast.error(intl.formatMessage(errorMessages.requestRejected));
            }
            // This is the new error condition from when the firewall responds a redirect to restricted.html
            if (errRes?.url?.endsWith("/restricted.html")) {
              toast.error(intl.formatMessage(errorMessages.requestRejected));
            }
          }
        }),
      );

  return exchange;
};

export default specialErrorExchange;
