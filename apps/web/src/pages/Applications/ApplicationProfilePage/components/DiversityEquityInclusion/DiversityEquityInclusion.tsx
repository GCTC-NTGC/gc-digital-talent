import React from "react";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useIntl } from "react-intl";

import { Heading, ToggleSection, Well } from "@gc-digital-talent/ui";

import EquityOptions from "~/components/EmploymentEquity/EquityOptions";
import { EquityKeys } from "~/components/EmploymentEquity/types";
import { wrapAbbr } from "~/utils/nameUtils";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/diversityEquityInclusion";

import applicationMessages from "~/messages/applicationMessages";
import { SectionProps } from "../../types";
import { getSectionIcon, getSectionTitle } from "../../utils";
import SectionTrigger from "../SectionTrigger";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const DiversityEquityInclusion = ({
  user,
  onUpdate,
  isUpdating,
  poolAdvertisement,
}: SectionProps) => {
  const intl = useIntl();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const isNull = hasAllEmptyFields(user);
  const title = getSectionTitle("dei");
  const isComplete = !hasEmptyRequiredFields(user, poolAdvertisement); // no empty required fields so false returns, means complete is true
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: isComplete,
    fallback: UserCircleIcon,
  });

  const handleUpdate = (key: EquityKeys, value: unknown) => {
    return onUpdate(user.id, {
      [key]: value,
    });
  };

  return (
    <ToggleSection.Root
      id="dei-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h5"
        toggle={
          <SectionTrigger>
            {intl.formatMessage({
              defaultMessage: "Edit diversity, equity, and inclusion",
              id: "UqkLAz",
              description: "Button text to start editing equity information",
            })}
          </SectionTrigger>
        }
      >
        {intl.formatMessage(title)}
      </ToggleSection.Header>
      {!isComplete && (
        <Well color="error">
          <p>{intl.formatMessage(applicationMessages.reservedForIndigenous)}</p>
        </Well>
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <NullDisplay /> : <Display user={user} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p data-h2-margin-bottom="base(x1)">
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
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>This section is optional, however, to be considered eligible for the <abbreviation>IT</abbreviation> Apprenticeship Program for Indigenous Peoples, you must self declare as Indigenous.</strong> If you are a member of one or more of these employment equity groups, and you do not wish to self identify on this platform, there is no obligation to do so. <strong>Complete the form below if you meet both of these conditions:</strong>",
                  id: "Nj6c0X",
                  description:
                    "Explanation that employment equity information is optional.",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
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
                    "You would like to be considered for opportunities addressed to underrepresented groups.",
                  id: "N+S2bh",
                  description:
                    "Instruction on when to fill out equity information, item two",
                })}
              </li>
            </ul>
          </Well>
          <Heading level="h4" size="h5">
            {intl.formatMessage({
              defaultMessage: "How will this data be used?",
              id: "ttRVSp",
              description:
                "Heading for how employment equity information will be used.",
            })}
          </Heading>
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
            isDisabled={isUpdating || false}
            headingLevel="h4"
            indigenousCommunities={user.indigenousCommunities}
            isVisibleMinority={user.isVisibleMinority}
            isWoman={user.isWoman}
            hasDisability={user.hasDisability}
            onAdd={(key: EquityKeys) => handleUpdate(key, true)}
            onRemove={(key: EquityKeys) => handleUpdate(key, false)}
            onUpdate={(key: EquityKeys, value: unknown) =>
              handleUpdate(key, value)
            }
          />
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default DiversityEquityInclusion;
