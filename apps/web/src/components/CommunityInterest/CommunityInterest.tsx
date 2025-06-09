import { useIntl } from "react-intl";

import {
  FinanceChiefDuty,
  FinanceChiefRole,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Separator, Ul } from "@gc-digital-talent/ui";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";

import BoolCheckIcon from "../BoolCheckIcon/BoolCheckIcon";
import DevelopmentProgramInterestItem from "./DevelopmentProgramInterestItem";

export const CommunityInterest_Fragment = graphql(/* GraphQL */ `
  fragment CommunityInterest on CommunityInterest {
    id
    community {
      id
      key
      workStreams {
        id
        name {
          localized
        }
      }
      developmentPrograms {
        id
        name {
          localized
        }
      }
      name {
        localized
      }
    }
    workStreams {
      id
    }
    interestInDevelopmentPrograms {
      developmentProgram {
        id
      }
      ...CommunityInterestDevelopmentProgramInterest
    }
    jobInterest
    trainingInterest
    additionalInformation
    financeIsChief
    financeAdditionalDuties {
      value
    }
    financeOtherRoles {
      value
    }
    financeOtherRolesOther
  }
`);

export const CommunityInterestOptions_Fragment = graphql(/* GraphQL */ `
  fragment CommunityInterestOptions on Query {
    financeChiefDuties: localizedEnumStrings(enumName: "FinanceChiefDuty") {
      value
      label {
        localized
      }
    }
    financeChiefRoles: localizedEnumStrings(enumName: "FinanceChiefRole") {
      value
      label {
        localized
      }
    }
  }
`);
interface CommunityInterestProps {
  communityInterestQuery: FragmentType<typeof CommunityInterest_Fragment>;
  communityInterestOptionsQuery: FragmentType<
    typeof CommunityInterestOptions_Fragment
  >;
  context?: "admin" | "applicant";
}

const CommunityInterest = ({
  communityInterestQuery,
  communityInterestOptionsQuery,
  context = "applicant",
}: CommunityInterestProps) => {
  const intl = useIntl();
  const communityInterest = getFragment(
    CommunityInterest_Fragment,
    communityInterestQuery,
  );
  const communityInterestOptions = getFragment(
    CommunityInterestOptions_Fragment,
    communityInterestOptionsQuery,
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const communityWorkStreams = unpackMaybes(
    communityInterest.community.workStreams,
  );
  const communityDevelopmentPrograms = unpackMaybes(
    communityInterest?.community.developmentPrograms,
  );
  const interestedWorkStreams = unpackMaybes(
    communityInterest?.workStreams,
  ).flatMap((workStream) => workStream.id);

  const asterisk =
    context === "applicant"
      ? intl.formatMessage(commonMessages.asterisk)
      : null;
  return (
    <>
      <p className="mb-1.5 font-bold">
        {intl.formatMessage({
          defaultMessage: "Interest in job opportunities",
          id: "dYsXAU",
          description:
            "Label for users interest in job opportunities for a community",
        })}
      </p>
      <BoolCheckIcon value={communityInterest.jobInterest} className="mb-6">
        {communityInterest.jobInterest ? (
          <span>
            {intl.formatMessage({
              defaultMessage: "Interested in work",
              id: "2L5LBG",
              description:
                "Message displayed when user expresses interest in job opportunities",
            })}
            {asterisk}
          </span>
        ) : (
          intl.formatMessage({
            defaultMessage: "Not interested in work",
            id: "szxveb",
            description:
              "Message displayed when a user has expressed they are not interested in job opportunities",
          })
        )}
      </BoolCheckIcon>
      <p className="mb-1.5 font-bold">
        {intl.formatMessage({
          defaultMessage: "Interest in training and development",
          id: "WfX9z1",
          description:
            "Label for user Interest in training and development for a community",
        })}
      </p>
      <BoolCheckIcon
        value={communityInterest.trainingInterest}
        className="mb-6"
      >
        {communityInterest.trainingInterest ? (
          <span>
            {intl.formatMessage({
              defaultMessage: "Interested in training or development",
              id: "f/XJsH",
              description:
                "Message when user expresses interest in training or development opportunities",
            })}
            {asterisk}
          </span>
        ) : (
          intl.formatMessage({
            defaultMessage: "Not interested in training or development",
            id: "TE28aU",
            description:
              "Message when user has expressed they are not interested in training or development opportunities",
          })
        )}
      </BoolCheckIcon>
      {context === "applicant" && (
        <p className="mb-6 text-sm font-normal text-gray-600 dark:text-gray-100">
          {intl.formatMessage({
            defaultMessage:
              "* Note that by indicating you’re interested in jobs or training opportunities, you agree to share your profile information with Government of Canada HR and recruitment staff within this community.",
            id: "EJPdqH",
            description:
              "Footnote for more information on interest in job and training opportunities",
          })}
        </p>
      )}
      {communityWorkStreams.length > 0 && (
        <>
          <p className="mb-1.5 font-bold">
            {intl.formatMessage({
              defaultMessage:
                "Preferred work streams for job and training opportunities",
              id: "EoEEha",
              description:
                "Label for the input for selecting work stream referral preferences",
            })}
          </p>
          <Ul unStyled space="md">
            {communityWorkStreams.map((workStream) => (
              <li key={workStream.id}>
                <BoolCheckIcon
                  value={interestedWorkStreams.includes(workStream.id)}
                  trueLabel={intl.formatMessage({
                    defaultMessage: "Interested in",
                    id: "AQiPuW",
                    description:
                      "Label for user expressing interest in a specific work stream",
                  })}
                  falseLabel={intl.formatMessage({
                    defaultMessage: "Not interested in",
                    id: "KyLikL",
                    description:
                      "Label for user expressing they are not interested in a specific work stream",
                  })}
                >
                  {workStream.name?.localized ?? notAvailable}
                </BoolCheckIcon>
              </li>
            ))}
          </Ul>
        </>
      )}
      {communityDevelopmentPrograms.length > 0 && (
        <>
          <Separator orientation="horizontal" decorative space="sm" />
          <p className="mb-1.5 font-bold">
            {intl.formatMessage({
              defaultMessage: "Leadership and professional development options",
              id: "UfwS5s",
              description:
                "Label for users interest in development programs for a community",
            })}
          </p>
          <Ul unStyled space="md">
            {communityDevelopmentPrograms
              .sort(
                sortAlphaBy(
                  (developmentProgram) => developmentProgram.name?.localized,
                ),
              )
              .map((developmentProgram) => {
                const interestedProgram =
                  communityInterest?.interestInDevelopmentPrograms?.find(
                    (interest) =>
                      interest?.developmentProgram?.id ===
                      developmentProgram.id,
                  );

                return (
                  <DevelopmentProgramInterestItem
                    key={developmentProgram.id}
                    developmentProgramInterestQuery={interestedProgram}
                    label={developmentProgram?.name?.localized ?? notAvailable}
                  />
                );
              })}
          </Ul>
        </>
      )}
      {!!communityInterest?.additionalInformation ||
      communityInterest.community.key === "finance" ? (
        <>
          <Separator orientation="horizontal" decorative space="sm" />
          {/* Some fields only appear for the finance community */}
          {communityInterest.community.key === "finance" ? (
            <>
              <p className="mb-1.5 font-bold">
                {intl.formatMessage({
                  defaultMessage: "CFO status",
                  id: "2KQdGz",
                  description:
                    "Bounding box label for the finance chief checkbox",
                })}
              </p>
              <BoolCheckIcon
                value={communityInterest.financeIsChief}
                className="mb-6"
              >
                {communityInterest.financeIsChief
                  ? intl.formatMessage({
                      defaultMessage: "I'm a Chief Financial Officer (CFO).",
                      id: "duKO+o",
                      description: "Message when user is a finance chief",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "I'm not a Chief Financial Officer (CFO).",
                      id: "+/6UIs",
                      description: "Message when user is not a finance chief",
                    })}
              </BoolCheckIcon>
              {communityInterest.financeIsChief ? (
                <>
                  <p className="mb-1.5 font-bold">
                    {intl.formatMessage({
                      defaultMessage: "Additional duties",
                      id: "E32ToC",
                      description:
                        "Label for additional duties of a finance chief",
                    })}
                  </p>
                  <Ul unStyled space="md" className="mb-6">
                    {communityInterestOptions.financeChiefDuties?.map(
                      (dutyOption) => (
                        <li key={dutyOption.value}>
                          <BoolCheckIcon
                            value={communityInterest.financeAdditionalDuties
                              ?.map((selectedDuty) => selectedDuty.value)
                              .includes(dutyOption.value as FinanceChiefDuty)}
                          >
                            {dutyOption.label.localized}
                          </BoolCheckIcon>
                        </li>
                      ),
                    )}
                  </Ul>
                  <p className="mb-1.5 font-bold">
                    {intl.formatMessage({
                      defaultMessage: "Other roles",
                      id: "z20NMR",
                      description: "Label for other roles of a finance chief",
                    })}
                  </p>
                  <Ul unStyled space="md" className="mb-6">
                    {communityInterestOptions.financeChiefRoles?.map(
                      (roleOption) => (
                        <li key={roleOption.value}>
                          <BoolCheckIcon
                            value={communityInterest.financeOtherRoles
                              ?.map((selectedRole) => selectedRole.value)
                              .includes(roleOption.value as FinanceChiefRole)}
                          >
                            {roleOption.label.localized}
                          </BoolCheckIcon>
                        </li>
                      ),
                    )}
                  </Ul>
                  {communityInterest.financeOtherRolesOther ? (
                    <>
                      <p className="mb-1.5 font-bold">
                        {intl.formatMessage({
                          defaultMessage:
                            "Other senior delegated official (SDO) position",
                          id: "qQYO+V",
                          description: "Label for the 'Other role' input",
                        })}
                      </p>
                      <p className="mb-6">
                        {communityInterest.financeOtherRolesOther}
                      </p>
                    </>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}
          <p className="mb-1.5 font-bold">
            {intl.formatMessage({
              defaultMessage: "Additional information",
              id: "NCMG9w",
              description:
                "Label for a community interests additional information",
            })}
          </p>
          <p>{communityInterest.additionalInformation}</p>
        </>
      ) : null}
    </>
  );
};

export default CommunityInterest;
