import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Accordion, Button, CardBasic, Heading } from "@gc-digital-talent/ui";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "@gc-digital-talent/graphql";

import experienceMessages from "~/messages/experienceMessages";
import useControlledCollapsibleGroup from "~/hooks/useControlledCollapsibleGroup";
import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import { Experience } from "~/components/ExperienceCard/types";

interface FullCareerExperiencesProps {
  experiences?: Omit<Experience, "user">[];
}

const FullCareerExperiences = ({ experiences }: FullCareerExperiencesProps) => {
  const intl = useIntl();

  const awardExperiences =
    experiences
      ?.filter(isAwardExperience)
      .map(
        (award: Omit<AwardExperience, "user">) =>
          ({
            ...award,
            startDate: award.awardedDate,
            endDate: award.awardedDate,
          }) as AwardExperience & { startDate: string; endDate: string },
      )
      .sort(compareByDate) ?? [];
  const communityExperiences: Omit<CommunityExperience, "user">[] =
    experiences?.filter(isCommunityExperience).sort(compareByDate) ?? [];
  const educationExperiences: Omit<EducationExperience, "user">[] =
    experiences?.filter(isEducationExperience).sort(compareByDate) ?? [];
  const personalExperiences: Omit<PersonalExperience, "user">[] =
    experiences?.filter(isPersonalExperience).sort(compareByDate) ?? [];
  const workExperiences: Omit<WorkExperience, "user">[] =
    experiences?.filter(isWorkExperience).sort(compareByDate) ?? [];

  const experienceSections = [
    {
      id: "WorkExperience",
      title: intl.formatMessage({
        defaultMessage: "Work experience",
        id: "ayIdMa",
        description: "Heading for work experiences",
      }),
      experiences: workExperiences,
    },
    {
      id: "AwardExperience",
      title: intl.formatMessage({
        defaultMessage: "Awards and recognition",
        id: "5KEERD",
        description: "Heading for awards",
      }),
      experiences: awardExperiences,
    },
    {
      id: "CommunityExperience",
      title: intl.formatMessage({
        defaultMessage: "Community participation",
        id: "g4quJR",
        description: "Heading for community experiences",
      }),
      experiences: communityExperiences,
    },
    {
      id: "EducationExperience",
      title: intl.formatMessage({
        defaultMessage: "Education and certificates",
        id: "tBudth",
        description: "Heading for education experiences",
      }),
      experiences: educationExperiences,
    },
    {
      id: "PersonalExperience",
      title: intl.formatMessage({
        defaultMessage: "Personal learning",
        id: "xqW2sR",
        description: "Heading for personal experiences",
      }),
      experiences: personalExperiences,
    },
  ];
  const sectionIds = experienceSections.map((section) => section.id);
  const {
    hasExpanded,
    toggleAllExpanded,
    toggleExpandedItem,
    isExpanded,
    expandedItems,
    setExpandedItems,
  } = useControlledCollapsibleGroup(sectionIds);

  return (
    <>
      <Heading
        level="h2"
        color="quaternary"
        data-h2-margin="base(x1.5 x1.5 0 x1.5)"
        data-h2-font-weight="base(400)"
        Icon={NewspaperIcon}
      >
        {intl.formatMessage({
          defaultMessage: "Full career",
          id: "+mG20j",
          description: "Heading for career experience",
        })}
        <p data-h2-margin-bottom="base(x.5)" data-h2-text-align="base(right)">
          <Button mode="inline" onClick={toggleAllExpanded}>
            {intl.formatMessage(
              hasExpanded
                ? experienceMessages.collapseDetails
                : experienceMessages.expandDetails,
            )}
          </Button>
        </p>
      </Heading>

      <p data-h2-margin="base(x.5 x1.5 x1 x1.5)">
        {intl.formatMessage({
          defaultMessage:
            "This section allows you to browse the nominee’s full career experience. By default, experience is organized by type, however you can choose to see how much experience the nominee has in a particular work stream or type of department using the options provided",
          id: "gu2wRn",
          description: "Description for the career page full career section",
        })}
      </p>
      <div>
        <Accordion.Root
          type="multiple"
          mode="card"
          value={expandedItems}
          onValueChange={(values) => setExpandedItems(values)} // Sync state with Accordion
          data-h2-margin="base(0, 0)"
        >
          {experienceSections
            .filter(
              ({ experiences: sectionExperiences }) =>
                sectionExperiences.length > 0,
            )
            .map(({ id, title, experiences: sectionExperiences }) => (
              <Accordion.Item key={`accordion-item-${id}`} value={id}>
                <Accordion.Trigger
                  onClick={() => toggleExpandedItem(id)}
                  aria-expanded={isExpanded(id)}
                >
                  {intl.formatMessage(
                    {
                      defaultMessage: "{title} ({count})",
                      id: "Rb4Khk",
                      description: "Title with the count of experiences",
                    },
                    { title, count: sectionExperiences.length },
                  )}
                </Accordion.Trigger>
                <Accordion.Content>
                  <CardBasic
                    data-h2-padding="base(0 0 0 x.5)"
                    data-h2-border-radius="base(0 0 0 x.5)"
                    data-h2-background-color="base(white)"
                    data-h2-box-shadow="base(0 0 0 x.5)"
                  >
                    {unpackMaybes(
                      sectionExperiences?.map((experience) => {
                        return (
                          <ExperienceCard
                            key={experience?.id}
                            experience={experience}
                            showEdit={false}
                            isOpen={isExpanded(experience?.id)}
                            onOpenChange={() =>
                              toggleExpandedItem(experience?.id)
                            }
                          />
                        );
                      }),
                    )}
                  </CardBasic>
                </Accordion.Content>
              </Accordion.Item>
            ))}
        </Accordion.Root>
      </div>
    </>
  );
};

export default FullCareerExperiences;
