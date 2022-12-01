import React from "react";
import { useIntl } from "react-intl";
import { BriefcaseIcon } from "@heroicons/react/24/solid";

import Well from "@common/components/Well";
import { navigationMessages } from "@common/messages";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";

import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import EquityOptions from "./EquityOptions";
import type { EmploymentEquityUpdateHandler, EquityKeys } from "./types";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import { User, PoolCandidate } from "../../api/generated";
import useRoutes from "../../hooks/useRoutes";

export interface EmploymentEquityFormProps {
  user: User;
  isMutating: boolean;
  application?: PoolCandidate;
  onUpdate: EmploymentEquityUpdateHandler;
}

export const EmploymentEquityForm: React.FC<EmploymentEquityFormProps> = ({
  user,
  application,
  onUpdate,
  isMutating,
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? paths.reviewApplication(application.id)
      : paths.profile(user.id);

  const handleUpdate = (key: EquityKeys, value: boolean) => {
    return onUpdate(user.id, {
      [key]: value,
    });
  };

  const applicationBreadcrumbs = application
    ? [
        {
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            id: "mq4G8h",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: paths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title: getFullPoolAdvertisementTitle(
            intl,
            application.poolAdvertisement,
          ),
          href: paths.pool(application.pool.id),
        },
        {
          href: paths.reviewApplication(application.id),
          title: intl.formatMessage(navigationMessages.stepOne),
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
      title={intl.formatMessage({
        defaultMessage: "Diversity, equity and inclusion",
        id: "TfoHYi",
        description:
          "Title for Profile Form wrapper  in DiversityEquityInclusionForm",
      })}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "Diversity, equity and inclusion",
            id: "pGTTrp",
            description:
              "Display Text for Diversity, equity and inclusion Page",
          }),
        },
      ]}
      cancelLink={{
        href: returnRoute,
        children: intl.formatMessage(
          application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
            ? navigationMessages.backToApplication
            : navigationMessages.backToProfile,
        ),
      }}
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
          {intl.formatMessage({
            defaultMessage:
              "<strong>This section is optional</strong>. If you are a member of one or more of these employment equity groups, and you do not wish to self identify on this platform, there is no obligation to do so. <strong>Complete the form below if you meet both of these conditions</strong>:",
            id: "zHaQlT",
            description:
              "Explanation that employment equity information is optional.",
          })}
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
                "You would like to be considered for opportunities addressed to  underrepresented groups.",
              id: "WZwXDb",
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
        isIndigenous={user.isIndigenous}
        isVisibleMinority={user.isVisibleMinority}
        isWoman={user.isWoman}
        hasDisability={user.hasDisability}
        onAdd={(key: EquityKeys) => handleUpdate(key, true)}
        onRemove={(key: EquityKeys) => handleUpdate(key, false)}
      />
      <ProfileFormFooter
        mode="cancelButton"
        cancelLink={{
          href: returnRoute,
          children: intl.formatMessage(
            application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
              ? navigationMessages.backToApplication
              : navigationMessages.backToProfile,
          ),
        }}
      />
    </ProfileFormWrapper>
  );
};

export default EmploymentEquityForm;
