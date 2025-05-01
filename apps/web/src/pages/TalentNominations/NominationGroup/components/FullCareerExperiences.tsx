import { useState } from "react";
import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import { Button, Heading, Well } from "@gc-digital-talent/ui";
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
  shareProfile?: boolean;
}

const FullCareerExperiences = ({
  experiences,
  shareProfile,
}: FullCareerExperiencesProps) => {
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
      title: intl.formatMessage(experienceMessages.work),
      experiences: workExperiences,
    },
    {
      id: "AwardExperience",
      title: intl.formatMessage(experienceMessages.award),
      experiences: awardExperiences,
    },
    {
      id: "CommunityExperience",
      title: intl.formatMessage(experienceMessages.community),
      experiences: communityExperiences,
    },
    {
      id: "EducationExperience",
      title: intl.formatMessage(experienceMessages.education),
      experiences: educationExperiences,
    },
    {
      id: "PersonalExperience",
      title: intl.formatMessage(experienceMessages.personal),
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
        {shareProfile && (
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
        )}
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
        {shareProfile && (
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
        )}
        {!shareProfile && (
          <Well data-h2-margin="base(0 x1.5 x1.75 x1.5)" color="error">
            <p data-h2-margin-bottom="base(x1)" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage:
                  "This nominee has not agreed to share their information with your community",
                id: "4ujr5X",
                description: "Null message for nominee profile",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Nominees can agree to provide access to their profile using the “Functional communities” tool on their dashboard.",
                id: "8plD42",
                description: "Null secondary message for nominee profile",
              })}
            </p>
          </Well>
        )}
      </div>
      <div>
        {shareProfile && selectedView === "type" && (
          <ExperienceByTypeAccordion
            experienceSections={experienceSections}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            toggleExpandedItem={toggleExpandedItem}
            isExpanded={isExpanded}
          />
        )}
        {shareProfile && selectedView === "workStream" && (
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
