import { useIntl } from "react-intl";
import UserIcon from "@heroicons/react/24/outline/UserIcon";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getEmploymentDuration,
  getEmploymentEquityGroup,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import {
  hasDiplomaToEducationLevel,
  positionDurationToEmploymentDuration,
} from "~/utils/searchRequestUtils";

import TalentRequestSectionCard from "./TalentRequestSectionCard";

const TalentRequestCriteriaCard_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestCriteriaCard on TalentRequest {
    applicantFilter {
      positionDuration
      flexibleWorkLocations {
        value
        label {
          localized
        }
      }
      languageAbility {
        label {
          localized
        }
      }
      equity {
        isWoman
        hasDisability
        isIndigenous
        isVisibleMinority
      }
      hasDiploma
      operationalRequirements {
        value
        label {
          localized
        }
      }
      locationPreferences {
        value
        label {
          localized
        }
      }
      skills {
        id
        name {
          localized
        }
      }
    }
  }
`);

interface TalentRequestCriteriaCardProps {
  query: FragmentType<typeof TalentRequestCriteriaCard_Fragment>;
}

const TalentRequestCriteriaCard = ({
  query,
}: TalentRequestCriteriaCardProps) => {
  const intl = useIntl();
  const { applicantFilter } = getFragment(
    TalentRequestCriteriaCard_Fragment,
    query,
  );
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const flexibleWorkLocations = unpackMaybes(
    applicantFilter?.flexibleWorkLocations,
  );
  const operationalRequirements = unpackMaybes(
    applicantFilter?.operationalRequirements,
  );
  const locations = unpackMaybes(applicantFilter?.locationPreferences);
  const skills = unpackMaybes(applicantFilter?.skills);

  const { isWoman, hasDisability, isIndigenous, isVisibleMinority } =
    applicantFilter?.equity ?? {};
  const requestedEquityGroup =
    isWoman || hasDisability || isIndigenous || isVisibleMinority;

  return (
    <TalentRequestSectionCard
      title={intl.formatMessage({
        defaultMessage: "Candidate criteria",
        id: "33ENCz",
        description:
          "Heading for section outlining the criteria submitted for a talent request",
      })}
      subtitle={intl.formatMessage({
        defaultMessage:
          "These are the requirements the ideal candidate needs to have for this job.",
        id: "aOpiSU",
        description: "Description of the talent request criteria submitted",
      })}
      icon={UserIcon}
      color="secondary"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.employmentDuration)}
        >
          {applicantFilter?.positionDuration
            ? intl.formatMessage(
                getEmploymentDuration(
                  positionDurationToEmploymentDuration(
                    applicantFilter.positionDuration,
                  ),
                ),
              )
            : notProvided}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.workLocation)}
        >
          {flexibleWorkLocations.length > 0 ? (
            <Ul>
              {flexibleWorkLocations.map(({ value, label }) => (
                <li key={value}>{label.localized ?? notProvided}</li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(
            talentRequestMessages.workingLanguageAbility,
          )}
        >
          {applicantFilter?.languageAbility?.label.localized ?? notProvided}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(commonMessages.employmentEquity)}
        >
          {requestedEquityGroup ? (
            <Ul>
              {isWoman && (
                <li>{intl.formatMessage(getEmploymentEquityGroup("woman"))}</li>
              )}
              {isVisibleMinority && (
                <li>
                  {intl.formatMessage(getEmploymentEquityGroup("minority"))}
                </li>
              )}
              {hasDisability && (
                <li>
                  {intl.formatMessage(getEmploymentEquityGroup("disability"))}
                </li>
              )}
              {isIndigenous && (
                <li>
                  {intl.formatMessage(getEmploymentEquityGroup("indigenous"))}
                </li>
              )}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.educationRequirement)}
        >
          {hasDiplomaToEducationLevel(applicantFilter?.hasDiploma, intl) ??
            notProvided}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(
            talentRequestMessages.conditionsOfEmployment,
          )}
        >
          {operationalRequirements.length > 0 ? (
            <Ul>
              {operationalRequirements.map(({ value, label }) => (
                <li key={value}>{label.localized ?? notProvided}</li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.onSiteLocations)}
        >
          {locations.length > 0 ? (
            <Ul>
              {locations.map(({ value, label }) => (
                <li key={value}>{label.localized ?? notProvided}</li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
      </div>
      <TalentRequestSectionCard.Separator />
      <FieldDisplay
        label={intl.formatMessage(
          {
            defaultMessage: "Selected skills ({numOfSkills})",
            id: "159+n7",
            description:
              "Title for skills section on summary of filters section",
          },
          { numOfSkills: skills.length ?? 0 },
        )}
      >
        {skills.length > 0 ? (
          <Ul>
            {skills.map(({ id, name }) => (
              <li key={id}>{name.localized ?? notProvided}</li>
            ))}
          </Ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
    </TalentRequestSectionCard>
  );
};

export default TalentRequestCriteriaCard;
