import { Button } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import * as React from "react";
import { useIntl } from "react-intl";
import { Pool, UserPublicProfile } from "../../api/generated";

const testId = (text: React.ReactNode) => (
  <span data-testid="candidateCount">{text}</span>
);

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

  return (
    <div data-h2-padding="base(x1)">
      <p data-h2-font-weight="base(700)">{pool?.name?.[locale]}</p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "There are <heavyPrimary><testId>{candidateCount}</testId></heavyPrimary> matching candidates in this pool",
            description:
              "Message for total estimated candidates box next to search form.",
          },
          {
            testId,
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
      <p data-h2-margin="base(x1, 0)">{pool?.description?.[locale]}</p>
      <Button color="cta" mode="solid" onClick={handleSubmit}>
        {intl.formatMessage({
          defaultMessage: "Request Candidates",
          description:
            "Button link message on search page that takes user to the request form.",
        })}
      </Button>
    </div>
  );
};

export default SearchPools;
