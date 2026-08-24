import { useIntl } from "react-intl";

import {
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { Chip, Chips, Ul } from "@gc-digital-talent/ui";
import {
  getEmploymentDuration,
  getOperationalRequirement,
  commonMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import type {
  LocalizedEnumString,
  LocalizedTalentRequestSource,
} from "@gc-digital-talent/graphql";
import { FlexibleWorkLocation } from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import {
  equitySelectionsToDescriptions,
  hasDiplomaToEducationLevel,
  positionDurationToEmploymentDuration,
} from "~/utils/talentRequestUtils";
import talentRequestMessages from "~/messages/talentRequestMessages";
import messages from "~/messages/profileMessages";
import type { PartialApplicantFilter } from "~/types/talentRequestForm";

import FilterBlock from "./FilterBlock";
import BoolCheckIcon from "../BoolCheckIcon/BoolCheckIcon";

const ApplicantFilters = ({
  applicantFilter,
  flexibleWorkLocationOptions,
}: {
  applicantFilter?: PartialApplicantFilter | null;
  flexibleWorkLocationOptions: LocalizedEnumString[];
}) => {
  const intl = useIntl();

  const classifications = applicantFilter?.qualifiedInClassifications ?? [];
  const classificationsFromApplicantFilter = classifications
    .filter(notEmpty)
    .map((classification) => wrapAbbr(classification.groupAndLevel, intl));

  const skills: string[] | undefined = applicantFilter?.skills?.map((skill) => {
    return (
      skill?.name?.localized ??
      intl.formatMessage({
        defaultMessage: "Error: skill name not found",
        id: "0T3NB0",
        description:
          "Error message when skill name is not found on request page.",
      })
    );
  });

  const employmentDuration: string | undefined =
    applicantFilter?.positionDuration
      ? intl.formatMessage(
          getEmploymentDuration(
            positionDurationToEmploymentDuration(
              applicantFilter.positionDuration,
            ),
          ),
        )
      : intl.formatMessage({
          defaultMessage: "(None selected)",
          id: "+O6J4u",
          description: "Text shown when the filter was not selected",
        });

  const educationLevel: string | undefined = hasDiplomaToEducationLevel(
    applicantFilter?.hasDiploma,
    intl,
  );

  const employmentEquity = equitySelectionsToDescriptions(
    applicantFilter?.equity,
    intl,
  );

  const operationalRequirementIds = unpackMaybes(
    applicantFilter?.operationalRequirements?.flatMap((req) => req?.value),
  );

  const operationalRequirements: string[] | undefined =
    operationalRequirementIds.map((id) =>
      intl.formatMessage(getOperationalRequirement(id)),
    );
  const languageAbility: string = applicantFilter?.languageAbility?.label
    ? getLocalizedName(applicantFilter.languageAbility.label, intl)
    : intl.formatMessage(commonMessages.anyLanguage);

  const workLocations = unpackMaybes(
    applicantFilter?.locationPreferences?.flatMap(
      (workRegion) => workRegion?.label,
    ),
  ).map((label) => getLocalizedName(label, intl));

  const streams = unpackMaybes(
    applicantFilter?.qualifiedInWorkStreams?.flatMap((stream) => stream?.name),
  ).map((label) => getLocalizedName(label, intl));

  const communityName: string = applicantFilter?.community
    ? getLocalizedName(applicantFilter.community.name, intl)
    : intl.formatMessage({
        defaultMessage: "(None selected)",
        id: "+O6J4u",
        description: "Text shown when the filter was not selected",
      });

  // not rendering ONSITE here
  const flexibleLocationOptions = flexibleWorkLocationOptions.filter(
    (loc) => loc.value !== (FlexibleWorkLocation.Onsite as string),
  );
  const filterFlexibleLocations = unpackMaybes(
    applicantFilter?.flexibleWorkLocations?.map((loc) => loc?.value),
  );

  return (
    <section className="grid gap-6 xs:grid-cols-2">
      <div>
        <div>
          <FilterBlock
            title={intl.formatMessage(talentRequestMessages.community)}
            content={communityName}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Pool requested",
              id: "HXF9GA",
              description:
                "Title for the pool block in the manager info section of the single search request view.",
            })}
            content={
              applicantFilter
                ? applicantFilter?.pools?.filter(notEmpty)?.map((pool) =>
                    getShortPoolTitleHtml(intl, {
                      workStream: pool.workStream,
                      name: pool.name,
                      classification: pool.classification,
                    }),
                  )
                : null
            }
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Group and level",
              id: "Rn5e/i",
              description:
                "Title for group and level on summary of filters section",
            })}
            content={uniqueItems(classificationsFromApplicantFilter)}
          />
          <FilterBlock
            title={intl.formatMessage(talentRequestMessages.stream)}
            content={streams}
          />
          <FilterBlock
            title={intl.formatMessage(
              {
                defaultMessage: "Selected skills ({numOfSkills})",
                id: "159+n7",
                description:
                  "Title for skills section on summary of filters section",
              },
              { numOfSkills: skills?.length ?? 0 },
            )}
            content={
              skills && skills?.length > 0 ? (
                <Chips>
                  {skills.map((skillName) => (
                    <Chip key={skillName} color="secondary">
                      {skillName}
                    </Chip>
                  ))}
                </Chips>
              ) : null
            }
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Education level",
              id: "ftAIM9",
              description:
                "Title for education level on summary of filters section",
            })}
            content={educationLevel}
          />
        </div>
      </div>
      <div>
        <div>
          <FilterBlock
            title={intl.formatMessage(commonMessages.workingLanguageAbility)}
            content={languageAbility}
          />
          {employmentDuration && (
            <FilterBlock
              title={intl.formatMessage(
                talentRequestMessages.employmentDuration,
              )}
              content={employmentDuration}
            />
          )}
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "On-site office",
              id: "59TDoK",
              description:
                "Legend for location preferences filter on search form.",
            })}
            content={workLocations}
          />
          <FilterBlock
            title={intl.formatMessage(messages.flexibleWorkLocationOptions)}
            content={
              <Ul unStyled noIndent inside>
                {flexibleLocationOptions.map((loc) => (
                  <li key={loc.value}>
                    <BoolCheckIcon
                      value={filterFlexibleLocations.includes(
                        loc.value as FlexibleWorkLocation,
                      )}
                      trueLabel={intl.formatMessage(commonMessages.interested)}
                      falseLabel={intl.formatMessage(
                        commonMessages.notInterested,
                      )}
                    >
                      {loc.label.localized}
                    </BoolCheckIcon>
                  </li>
                ))}
              </Ul>
            }
          />
          <FilterBlock
            title={intl.formatMessage(commonMessages.employmentEquity)}
            content={employmentEquity}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage:
                "Conditions of employment or operational requirements",
              id: "SNxTm+",
              description:
                "Title for operational requirements section on summary of filters section",
            })}
            content={operationalRequirements}
          />
        </div>
      </div>
    </section>
  );
};

interface SearchRequestFiltersProps {
  filters?: PartialApplicantFilter | null;
  flexibleWorkLocationOptions: LocalizedEnumString[];
  talentSourceOptions?: LocalizedTalentRequestSource[];
}

const SearchRequestFilters = ({
  filters,
  flexibleWorkLocationOptions,
}: SearchRequestFiltersProps) => (
  <ApplicantFilters
    applicantFilter={filters}
    flexibleWorkLocationOptions={flexibleWorkLocationOptions}
  />
);

export default SearchRequestFilters;
