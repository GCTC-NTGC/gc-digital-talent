import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Notice } from "@gc-digital-talent/ui";

const TalentRequestEmptyNotice_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestEmptyNotice on TalentRequest {
    wasEmpty
  }
`);

interface TalentRequestEmptyNoticeProps {
  query: FragmentType<typeof TalentRequestEmptyNotice_Fragment>;
}

const TalentRequestEmptyNotice = ({ query }: TalentRequestEmptyNoticeProps) => {
  const intl = useIntl();
  const talentRequest = getFragment(TalentRequestEmptyNotice_Fragment, query);

  if (!talentRequest.wasEmpty) return null;

  return (
    <Notice.Root color="warning">
      <Notice.Title defaultIcon>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This request was submitted with zero matching candidates.",
            id: "yN1xmK",
            description:
              "Warning message displayed when a talent request was submitted with no matching candidates.",
          })}
        </p>
      </Notice.Title>
    </Notice.Root>
  );
};

export default TalentRequestEmptyNotice;
