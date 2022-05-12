import { Button } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import * as React from "react";
import { useIntl } from "react-intl";
import { Pool, UserPublicProfile } from "../../api/generated";

interface SearchPoolsProps {
  candidateCount: number;
  pool?: Pick<Pool, "name" | "description">;
  poolOwner?: Pick<UserPublicProfile, "firstName" | "lastName">;
  handleSubmit: () => Promise<void>;
}

const SearchPools: React.FunctionComponent<SearchPoolsProps> = ({
  candidateCount,
  pool,
  poolOwner,
  handleSubmit,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  function bold(msg: string) {
    return (
      <span
        data-h2-font-weight="b(700)"
        data-h2-font-color="b(lightpurple)"
        data-testid="candidateCount"
      >
        {msg}
      </span>
    );
  }
  return (
    <>
      <div
        data-h2-flex-item="b(1of1) m(1of2)"
        style={{ padding: "0", paddingLeft: "1rem" }}
      >
        <p data-h2-margin="b(bottom, none)" data-h2-font-weight="b(700)">
          {pool?.name?.[locale]}
        </p>
        <p
          data-h2-margin="b(top, xxs) b(bottom, m)"
          data-h2-font-weight="b(200)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "There are <bold>{candidateCount}</bold> matching candidates in this pool",
              description:
                "Message for total estimated candidates box next to search form.",
            },
            {
              bold,
              candidateCount,
            },
          )}
        </p>
        <p data-h2-margin="b(bottom, none)" data-h2-font-size="b(caption)">
          {intl.formatMessage(
            {
              defaultMessage: "Pool Owner: {firstName} {lastName}",
              description: "Text showing the owner of the HR pool.",
            },
            {
              firstName: poolOwner?.firstName,
              lastName: poolOwner?.lastName,
            },
          )}
        </p>
        <p data-h2-margin="b(bottom, s)" data-h2-font-size="b(caption)">
          {pool?.description?.[locale]}
        </p>
      </div>
      <div
        data-h2-flex-item="b(1of1) m(1of2)"
        data-h2-display="b(flex)"
        data-h2-justify-content="b(center) m(flex-end)"
      >
        <Button color="cta" mode="solid" onClick={handleSubmit}>
          {intl.formatMessage({
            defaultMessage: "Request Candidates",
            description:
              "Button link message on search page that takes user to the request form.",
          })}
        </Button>
      </div>
    </>
  );
};

export default SearchPools;
