import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { HeadingRank, Well } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { Select } from "@gc-digital-talent/forms";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  Experience,
  PersonalExperience,
  WorkExperience,
} from "~/api/generated";
import experienceMessages from "~/messages/experienceMessages";
import AddExperienceDialog from "~/pages/Profile/ResumeAndRecruitmentsPage/components/AddExperienceDialog";

import { notEmpty } from "@gc-digital-talent/helpers";
import { ExperienceForDate } from "~/types/experience";
import { PAST_DATE } from "@gc-digital-talent/date-helpers";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";

type SortOptions = "date_desc" | "date_asc";
type FilterOptions =
  | "none"
  | NonNullable<AwardExperience["__typename"]>
  | NonNullable<CommunityExperience["__typename"]>
  | NonNullable<EducationExperience["__typename"]>
  | NonNullable<PersonalExperience["__typename"]>
  | NonNullable<WorkExperience["__typename"]>;

type FormValues = {
  sortBy: SortOptions;
  filterBy: FilterOptions;
};

export interface ExperienceSectionProps {
  experiences?: Experience[];
  editParam?: string;
  headingLevel?: HeadingRank;
  applicantId?: string;
  nullMessage?: React.ReactNode;
}

const ExperienceSection = ({
  experiences,
  editParam,
  headingLevel = "h3",
  applicantId,
  nullMessage,
}: ExperienceSectionProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      sortBy: "date_desc",
      filterBy: "none",
    },
  });
  const { watch } = methods;
  const [sortBy, filterBy] = watch(["sortBy", "filterBy"]);

  const experiencesNotNull = experiences?.filter(notEmpty) ?? [];

  const experiencesDateNormalized: ExperienceForDate[] = experiencesNotNull.map(
    (experience) => {
      if (isAwardExperience(experience)) {
        const e: ExperienceForDate = {
          ...experience,
          startDate: experience.awardedDate ?? PAST_DATE,
          endDate: experience.awardedDate ?? PAST_DATE,
        };
        return e;
      }
      return experience;
    },
  );

  let experiencesFiltered;
  switch (filterBy) {
    case "AwardExperience":
      experiencesFiltered = experiencesDateNormalized.filter(isAwardExperience);
      break;
    case "CommunityExperience":
      experiencesFiltered = experiencesDateNormalized.filter(
        isCommunityExperience,
      );
      break;
    case "EducationExperience":
      experiencesFiltered = experiencesDateNormalized.filter(
        isEducationExperience,
      );
      break;
    case "PersonalExperience":
      experiencesFiltered =
        experiencesDateNormalized.filter(isPersonalExperience);
      break;
    case "WorkExperience":
      experiencesFiltered = experiencesDateNormalized.filter(isWorkExperience);
      break;
    default:
      experiencesFiltered = experiencesDateNormalized;
  }

  const experiencesSorted = experiencesFiltered;
  switch (sortBy) {
    case "date_asc":
      experiencesSorted.sort((e1, e2) => {
        return compareByDate(e1, e2) * -1;
      });
      break;
    case "date_desc":
      experiencesSorted.sort(compareByDate);
      break;
    default:
      break;
  }

  const experiencesDisplay = experiencesSorted;

  const hasExperiences = experiencesNotNull.length >= 1;

  const sortOptions: Array<{
    value: FormValues["sortBy"];
    label: React.ReactNode;
  }> = [
    {
      value: "date_desc",
      label: intl.formatMessage(formMessages.byDateDescending),
    },
    {
      value: "date_asc",
      label: intl.formatMessage(formMessages.byDateAscending),
    },
  ];

  const filterOptions: Array<{
    value: FormValues["filterBy"];
    label: React.ReactNode;
  }> = [
    {
      value: "none",
      label: intl.formatMessage(formMessages.allTypes),
    },
    {
      value: "AwardExperience",
      label: intl.formatMessage(experienceMessages.award),
    },
    {
      value: "CommunityExperience",
      label: intl.formatMessage(experienceMessages.community),
    },
    {
      value: "EducationExperience",
      label: intl.formatMessage(experienceMessages.education),
    },
    {
      value: "PersonalExperience",
      label: intl.formatMessage(experienceMessages.personal),
    },
    {
      value: "WorkExperience",
      label: intl.formatMessage(experienceMessages.work),
    },
  ];

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <div data-h2-flex-grid="base(center, x1, x1)">
            <div
              data-h2-flex-item="base(1of1) p-tablet(content)"
              data-h2-align-self="base(flex-end)"
            >
              <Select
                id="sortBy"
                label={intl.formatMessage({
                  defaultMessage: "Sort experience by",
                  id: "2n0e2i",
                  description:
                    "Label for selector to choose experience sort options",
                })}
                name="sortBy"
                options={sortOptions}
                hideOptional
                trackUnsaved={false}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(content)">
              <Select
                id="filterBy"
                label={intl.formatMessage({
                  defaultMessage: "Filter experience by type",
                  id: "PE7mMC",
                  description:
                    "Label for selector to choose experience filter options",
                })}
                name="filterBy"
                options={filterOptions}
                hideOptional
                trackUnsaved={false}
              />
            </div>

            <div data-h2-flex-item="base(0of1) p-tablet(fill)">
              {/* spacer */}
            </div>
            {applicantId ? (
              <div
                data-h2-flex-item="base(1of1) p-tablet(content)"
                data-h2-margin="base(x1, 0)"
              >
                <AddExperienceDialog applicantId={applicantId} />
              </div>
            ) : null}
          </div>
        </form>
      </FormProvider>
      {hasExperiences ? (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {experiencesDisplay.map((experience) => (
            <ExperienceCard
              headingLevel={headingLevel}
              key={experience.id}
              experience={experience}
              editParam={editParam}
            />
          ))}
        </div>
      ) : (
        <Well data-h2-text-align="base(center)">
          {nullMessage ?? (
            <p>
              {intl.formatMessage({
                defaultMessage: "No information has been provided",
                id: "4Xa7Pd",
                description:
                  "Message on Admin side when user not filled Experience section.",
              })}
            </p>
          )}
        </Well>
      )}
    </>
  );
};

export default ExperienceSection;
