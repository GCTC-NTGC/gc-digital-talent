import React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { UpdateUserAsUserInput } from "@gc-digital-talent/graphql";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { User, PoolCandidate } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import useApplicationInfo from "~/hooks/useApplicationInfo";
import ProfileFormWrapper, {
  ProfileFormFooter,
} from "~/components/ProfileFormWrapper/ProfileFormWrapper";
import { wrapAbbr } from "~/utils/nameUtils";
import EquityOptions from "~/components/EmploymentEquity/EquityOptions";
import { EquityKeys } from "~/components/EmploymentEquity/types";

import type { EmploymentEquityUpdateHandler } from "../../types";

export interface EmploymentEquityFormProps {
  user: User;
  isMutating: boolean;
  application?: PoolCandidate;
  onUpdate: EmploymentEquityUpdateHandler;
}

const EmploymentEquityForm = ({
  user,
  application,
  onUpdate,
  isMutating,
}: EmploymentEquityFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { id: applicationId, returnRoute } = useApplicationInfo(user.id);

  const handleUpdate = (data: UpdateUserAsUserInput) => {
    return onUpdate(user.id, data);
  };

  const applicationBreadcrumbs = application
    ? [
        {
          label: intl.formatMessage({
            defaultMessage: "My applications",
            id: "bdDvMZ",
            description:
              "My applications breadcrumb from applicant profile wrapper.",
          }),
          url: paths.applications(application.user.id),
        },
        {
          label: getFullPoolTitleHtml(intl, application.pool),
          url: paths.pool(application.pool.id),
        },
        {
          label: intl.formatMessage(navigationMessages.stepOne),
          url: paths.reviewApplication(applicationId ?? ""),
        },
        {
          label: intl.formatMessage(
            navigationMessages.diversityEquityInclusion,
          ),
          url: `${paths.diversityEquityInclusion(user.id)}${
            applicationId ? `?applicationId=${applicationId}` : ``
          }`,
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "The Employment Equity Act of Canada (1995) identifies four groups who have experienced systemic employment barriers, and a number of obligations for the Government of Canada in addressing these barriers.",
        id: "Or11km",
        description:
          "Description text for Profile Form wrapper in DiversityEquityInclusionForm",
      })}
      title={intl.formatMessage(navigationMessages.diversityEquityInclusion)}
      crumbs={
        applicationBreadcrumbs?.length
          ? applicationBreadcrumbs
          : [
              {
                label: intl.formatMessage(
                  navigationMessages.diversityEquityInclusion,
                ),
                url: paths.diversityEquityInclusion(user.id),
              },
            ]
      }
      prefixBreadcrumbs={!application}
    >
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "While the language around these categories is in need of updating, the Government of Canada will sometimes use these categories in hiring to make sure that it is meeting the aims of employment equity.",
          id: "usb0gM",
          description:
            "Description of how the Government of Canada uses employment equity categories in hiring.",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            'These four groups are "women, Aboriginal peoples, persons with disabilities, and members of visible minorities."',
          id: "uQYCfd",
          description: "List of the employment equity categories",
        })}
      </p>
      <Well data-h2-margin="base(x2, 0, 0, 0)">
        <p data-h2-margin="base(0, 0, x.5, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "<strong>This section is optional, however, to be considered eligible for the <abbreviation>IT</abbreviation> Apprenticeship Program for Indigenous Peoples, you must self declare as Indigenous.</strong> If you are a member of one or more of these employment equity groups, and you do not wish to self identify on this platform, there is no obligation to do so. <strong>Complete the form below if you meet both of these conditions:</strong>",
              id: "Nj6c0X",
              description:
                "Explanation that employment equity information is optional.",
            },
            {
              abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
            },
          )}
        </p>
        <ul>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "You are a member of one or more of these employment equity groups.",
              id: "6cYs7i",
              description:
                "Instruction on when to fill out equity information, item one",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "You would like to be considered for opportunities addressed to underrepresented groups.",
              id: "N+S2bh",
              description:
                "Instruction on when to fill out equity information, item two",
            })}
          </li>
        </ul>
      </Well>
      <h2 data-h2-font-size="base(h5, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "How will this data be used?",
          id: "ttRVSp",
          description:
            "Heading for how employment equity information will be used.",
        })}
      </h2>
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This information will be shared with hiring managers.",
            id: "dh2xc5",
            description:
              "Explanation on how employment equity information will be used, item one",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This information will be used to match you to prioritized jobs.",
            id: "zqBqj1",
            description:
              "Explanation on how employment equity information will be used, item two",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This information will be used in an anonymous form for statistical purposes.",
            id: "QpfFEG",
            description:
              "Explanation on how employment equity information will be used, item three",
          })}
        </li>
      </ul>
      <EquityOptions
        isDisabled={isMutating}
        indigenousCommunities={user.indigenousCommunities}
        isVisibleMinority={user.isVisibleMinority}
        isWoman={user.isWoman}
        hasDisability={user.hasDisability}
        onAdd={(key: EquityKeys) => handleUpdate({ [key]: true })}
        onRemove={(key: EquityKeys) => handleUpdate({ [key]: false })}
        onUpdate={handleUpdate}
        inApplication={!!application}
      />
      <ProfileFormFooter
        mode="cancelButton"
        cancelLink={{
          href: returnRoute || paths.profile(user.id),
          children: intl.formatMessage(
            application
              ? navigationMessages.backToApplication
              : navigationMessages.backToProfile,
          ),
        }}
      />
    </ProfileFormWrapper>
  );
};

export default EmploymentEquityForm;
