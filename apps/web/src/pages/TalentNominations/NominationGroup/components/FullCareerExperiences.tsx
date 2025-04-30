import { useState } from "react";
import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import { Button, Heading } from "@gc-digital-talent/ui";
import { AwardExperience, Experience } from "@gc-digital-talent/graphql";

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

import ExperienceByTypeAccordion from "./ExperienceByTypeAccordion";

interface FullCareerExperiencesProps {
  experiences?: Omit<Experience, "user">[];
}

const FullCareerExperiences = ({ experiences }: FullCareerExperiencesProps) => {
  const intl = useIntl();
  const [selectedView, setSelectedView] = useState<"type" | "workStream">(
    "type",
  );
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
  const communityExperiences =
    experiences?.filter(isCommunityExperience).sort(compareByDate) ?? [];
  const educationExperiences =
    experiences?.filter(isEducationExperience).sort(compareByDate) ?? [];
  const personalExperiences =
    experiences?.filter(isPersonalExperience).sort(compareByDate) ?? [];
  const workExperiences =
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
      {/* heading section */}
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
      >
        <div>
          <Heading
            level="h2"
            Icon={NewspaperIcon}
            color="quaternary"
            data-h2-font-weight="base(400)"
            data-h2-margin="base(0)"
          >
            {intl.formatMessage({
              defaultMessage: "Full career",
              id: "+mG20j",
              description: "Heading for career experience",
            })}
          </Heading>
        </div>
        <div>
          <Button
            type="button"
            mode="inline"
            color="secondary"
            onClick={toggleAllExpanded}
          >
            {intl.formatMessage(
              hasExpanded
                ? experienceMessages.collapseDetails
                : experienceMessages.expandDetails,
            )}
          </Button>
        </div>
      </div>

      <p data-h2-margin="base(x.5 x1.5 x1 x1.5)">
        {intl.formatMessage({
          defaultMessage:
            "This section allows you to browse the nominee’s full career experience. By default, experience is organized by type, however you can choose to see how much experience the nominee has in a particular work stream or type of department using the options provided",
          id: "gu2wRn",
          description: "Description for the career page full career section",
        })}
      </p>
      <div>
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(x1)"
        >
          <p data-h2-margin="base(0)">
            {intl.formatMessage({
              defaultMessage: "Show experience by:",
              id: "KR4kRt",
              description: "Label for experience sorting options",
            })}
          </p>
          <Button
            type="button"
            mode="inline"
            color="secondary"
            onClick={() => setSelectedView("type")}
            data-h2-font-weight={
              selectedView === "type" ? "base(700)" : "base(400)"
            }
          >
            {intl.formatMessage({
              defaultMessage: "Type",
              id: "trerKD",
              description: "Button to filter experiences by type",
            })}
          </Button>
          <Button
            type="button"
            mode="inline"
            color="secondary"
            onClick={() => setSelectedView("workStream")} // Set view to "workStream"
            data-h2-font-weight={
              selectedView === "workStream" ? "base(700)" : "base(400)"
            } // Bold when selected
            aria-pressed={selectedView === "workStream"}
          >
            {intl.formatMessage({
              defaultMessage: "Work Stream",
              id: "27YVit",
              description: "Button to filter experiences by work stream",
            })}
          </Button>
        </div>
      </div>
      <div>
        {selectedView === "type" && (
          <ExperienceByTypeAccordion
            experienceSections={experienceSections}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            toggleExpandedItem={toggleExpandedItem}
            isExpanded={isExpanded}
          />
        )}
        {selectedView === "workStream" && (
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1 0)"
          ></div>
        )}
      </div>
    </>
  );
};

export default FullCareerExperiences;
