import { Button } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import * as React from "react";
import { useIntl } from "react-intl";
import { Pool, UserPublicProfile } from "../../api/generated";

export interface SearchPoolsProps {
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
        data-h2-font-weight="base(700)"
        data-h2-color="base(dt-primary)"
        data-testid="candidateCount"
      >
        {msg}
      </span>
    );
  }
  return (
    <>
      <div data-h2-padding="base(x1)">
        <p data-h2-font-weight="base(700)">
          {pool?.name?.[locale]}
        </p>
        <p data-h2-margin="base(x.5, 0, x1, 0)">
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
        <p data-h2-margin="base(x1, 0, 0, 0)">
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
        <p data-h2-margin="base(x1, 0)">
          {pool?.description?.[locale]}
        </p>
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
