import React, { useRef, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

import {
  Button,
  ButtonLinkMode,
  Color,
  DropdownMenu,
} from "@gc-digital-talent/ui";
import {
  UserProfilePrintButton_UserFragmentFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import printStyles from "~/styles/printStyles";
import ProfileDocument from "~/components/ProfileDocument/ProfileDocument";

type UserProfileDocumentTypes = "all-info" | "anonymous";

export const UserProfilePrintButton_UserFragment = graphql(/* GraphQL */ `
  fragment UserProfilePrintButton_UserFragment on User {
    id
    firstName
    lastName
    email
    telephone
    currentCity
    currentProvince
    preferredLang
    preferredLanguageForInterview
    preferredLanguageForExam
    armedForcesStatus
    citizenship
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    bilingualEvaluation
    comprehensionLevel
    writtenLevel
    verbalLevel
    estimatedLanguageAbility
    isGovEmployee
    department {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    govEmployeeType
    currentClassification {
      id
      group
      level
    }
    hasPriorityEntitlement
    priorityNumber
    locationPreferences
    locationExemptions
    positionDuration
    acceptedOperationalRequirements
    isWoman
    hasDisability
    isVisibleMinority
    indigenousCommunities
    topTechnicalSkillsRanking {
      id
      skillLevel
      skill {
        id
        category
        key
        name {
          en
          fr
        }
      }
      user {
        id
      }
    }
    topBehaviouralSkillsRanking {
      id
      skillLevel
      skill {
        id
        category
        key
        name {
          en
          fr
        }
      }
      user {
        id
      }
    }
    improveTechnicalSkillsRanking {
      id
      skillLevel
      skill {
        id
        category
        key
        name {
          en
          fr
        }
      }
      user {
        id
      }
    }
    improveBehaviouralSkillsRanking {
      id
      skillLevel
      skill {
        id
        category
        key
        name {
          en
          fr
        }
      }
      user {
        id
      }
    }
    experiences {
      id
      details
      user {
        id
      }
      skills {
        id
        category
        key
        name {
          en
          fr
        }
        experienceSkillRecord {
          details
        }
      }
      ... on AwardExperience {
        awardedDate
        title
        awardedTo
        issuedBy
        awardedScope
      }
      ... on CommunityExperience {
        startDate
        endDate
        title
        organization
        project
      }
      ... on EducationExperience {
        startDate
        endDate
        areaOfStudy
        institution
        status
        thesisTitle
      }
      ... on PersonalExperience {
        startDate
        endDate
        title
        description
      }
      ... on WorkExperience {
        startDate
        endDate
        role
        organization
        division
      }
    }
  }
`);

interface UserProfilePrintButtonProps {
  users: Array<UserProfilePrintButton_UserFragmentFragment>;
  color: Color;
  mode: ButtonLinkMode;
  fontSize?: "caption" | "body";
  beforePrint?: (handlePrint: () => void) => void;
}

const UserProfilePrintButton = ({
  users,
  color,
  mode,
  fontSize = "body",
  beforePrint,
}: UserProfilePrintButtonProps) => {
  const intl = useIntl();

  const [isAnonymous, setAnonymous] = useState<UserProfileDocumentTypes | "">(
    "",
  );
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle:
      users.length === 1
        ? intl.formatMessage({
            defaultMessage: "Candidate profile",
            id: "mVmrEn",
            description: "Document title for printing User profile",
          })
        : intl.formatMessage({
            defaultMessage: "Candidate profiles",
            id: "scef3o",
            description: "Document title for printing User table results",
          }),
    onAfterPrint: () => {
      // Reset the state so we can print again
      setAnonymous("");
    },
  });

  const handlePrintChange = (value: string) => {
    if (value === "all-info" || value === "anonymous") setAnonymous(value);
  };

  useEffect(() => {
    if (isAnonymous) {
      if (beforePrint) beforePrint(handlePrint);
      else handlePrint();
    }
  }, [isAnonymous, handlePrint, beforePrint]);

  let margin = {};
  if (fontSize === "caption") {
    margin = { "data-h2-margin-top": "base(-2px)" };
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            color={color}
            mode={mode}
            fontSize={fontSize}
            utilityIcon={ChevronDownIcon}
            data-h2-font-weight="base(400)"
            {...margin}
          >
            {intl.formatMessage({
              defaultMessage: "Print profile",
              id: "Yr0nVZ",
              description: "Text label for button to print items in a table",
            })}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" collisionPadding={2}>
          <DropdownMenu.RadioGroup
            value={isAnonymous}
            onValueChange={handlePrintChange}
          >
            <DropdownMenu.RadioItem value="all-info">
              {intl.formatMessage({
                defaultMessage: "Print with all information",
                id: "qN+dwB",
                description: "Button label for print user profile.",
              })}
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="anonymous">
              {intl.formatMessage({
                defaultMessage: "Print without contact information",
                id: "c795MO",
                description: "Button label for print user anonymous profile.",
              })}
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <ProfileDocument
        anonymous={isAnonymous === "anonymous"}
        results={users}
        ref={componentRef}
      />
    </>
  );
};

export default UserProfilePrintButton;
