import { useState } from "react";
import { useIntl } from "react-intl";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";
import uniq from "lodash/uniq";

import { Button, Heading, Well } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { empty, notEmpty } from "@gc-digital-talent/helpers";

import experienceMessages from "~/messages/experienceMessages";

import ExperienceByTypeAccordion from "./ExperienceByTypeAccordion";
// import ExperienceByWorkStreamAccordion from "./ExperienceByWorkStreamAccordion";

export const FullCareerExperiences_Fragment = graphql(/* GraphQL */ `
  fragment FullCareerExperiences on User {
    experiences {
      id
      ...ExperienceCard
    }
  }
`);

interface FullCareerExperiencesProps {
  query?: FragmentType<typeof FullCareerExperiences_Fragment>;
  shareProfile?: boolean;
  defaultOpen?: boolean;
}

const FullCareerExperiences = ({
  query,
  shareProfile,
  defaultOpen = false,
}: FullCareerExperiencesProps) => {
  const intl = useIntl();
  const data = getFragment(FullCareerExperiences_Fragment, query);
  const experiences = data?.experiences?.filter(notEmpty) ?? [];
  const [selectedView, setSelectedView] = useState<"type" | "workStream">(
    "type",
  );

  let sectionIds: string[] = [];
  if (selectedView == "type") {
    sectionIds =
      uniq(experiences.map((e) => e.__typename?.toString()).filter(notEmpty)) ??
      [];
  }
  // if (selectedView == "workStream") {
  //   sectionIds =
  //     uniq(experiences.map((e) => e.__typename)).filter(notEmpty) ?? [];
  // }

  const [openSections, setOpenSections] = useState<string[]>(
    defaultOpen ? sectionIds : [],
  );
  const hasOpenSections = openSections.length > 0;

  const toggleSections = () => {
    setOpenSections((currentOpen) => {
      return currentOpen.length > 0 ? [] : sectionIds;
    });
  };

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
              onClick={toggleSections}
            >
              {intl.formatMessage(
                hasOpenSections
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
        {shareProfile && selectedView === "type" && !empty(query) && (
          <ExperienceByTypeAccordion
            query={query}
            openSections={openSections}
            setOpenSections={setOpenSections}
          />
        )}
        {/* {shareProfile && selectedView === "workStream" && (
          <ExperienceByWorkStreamAccordion
            experienceSections={experienceSections}
            openSections={openSections}
            setOpenSections={setOpenSections}
          />
        )} */}
      </div>
    </>
  );
};

export default FullCareerExperiences;
