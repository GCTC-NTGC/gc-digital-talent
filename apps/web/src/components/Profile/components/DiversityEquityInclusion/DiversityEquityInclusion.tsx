import { useState } from "react";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import { useIntl } from "react-intl";

import { Accordion, Heading, Ul, Well } from "@gc-digital-talent/ui";
import { Pool, UpdateUserAsUserInput } from "@gc-digital-talent/graphql";

import EquityOptions from "~/components/EmploymentEquity/EquityOptions";
import { EquityKeys } from "~/components/EmploymentEquity/types";
import { hasEmptyRequiredFields } from "~/validators/profile/diversityEquityInclusion";
import applicationMessages from "~/messages/applicationMessages";

import { SectionProps } from "../../types";
import { getSectionTitle } from "../../utils";

type AccordionItems = "information" | "";

const DiversityEquityInclusion = ({
  user,
  onUpdate,
  pool,
}: SectionProps<Pick<Pool, "publishingGroup">>) => {
  const intl = useIntl();
  const title = getSectionTitle("dei");
  const isComplete = !hasEmptyRequiredFields(user, {
    publishingGroup: pool?.publishingGroup,
  }); // no empty required fields so false returns, means complete is true
  const [accordionOpen, setAccordionOpen] = useState<AccordionItems>(""); // Start with accordion closed

  const handleUpdate = (data: UpdateUserAsUserInput) => {
    return onUpdate(user.id, data);
  };

  return (
    <>
      <Heading
        className="mt-0 mb-6 font-normal"
        icon={UsersIcon}
        color="primary"
        level={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
      >
        {intl.formatMessage(title)}
      </Heading>
      {!isComplete && (
        <Well color="error">
          <p>{intl.formatMessage(applicationMessages.reservedForIndigenous)}</p>
        </Well>
      )}
      {intl.formatMessage({
        defaultMessage:
          "This section offers the ability to identify employment equity groups that apply to you. Complete this section if you meet both of these conditions:",
        id: "iKWOl+",
        description: "Introduction text for selecting employment equity groups",
      })}
      <Ul className="my-3">
        <li>
          {intl.formatMessage({
            defaultMessage:
              "You are a member of one or more of these employment equity groups.",
            id: "tOohws",
            description:
              "First condition for selecting an employment equity group",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "You are comfortable sharing your employment equity information for recruitment opportunities and anonymized statistical purposes.",
            id: "OgizOq",
            description:
              "Second condition for selecting an employment equity group",
          })}
        </li>
      </Ul>
      <Accordion.Root
        type="single"
        size="sm"
        value={accordionOpen}
        onValueChange={(value: AccordionItems) => setAccordionOpen(value)}
        collapsible
      >
        <Accordion.Item value="information">
          <Accordion.Trigger as="h3">
            {accordionOpen === "information"
              ? intl.formatMessage({
                  defaultMessage:
                    "Hide more information about employment equity",
                  id: "IJyxRd",
                  description:
                    "Heading for closing the accordion with information on employment equity",
                })
              : intl.formatMessage({
                  defaultMessage: "More information about employment equity",
                  id: "q+bkac",
                  description:
                    "Heading for opening the accordion with information on employment equity",
                })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "While the language around these categories is being updated, the Government of Canada will sometimes use these categories in hiring to ensure that it is meeting its employment equity goals.",
                id: "DgjNQa",
                description:
                  "Description of how the Government of Canada uses employment equity categories in hiring.",
              })}
            </p>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "The four equity groups are women, Aboriginal (Indigenous) peoples, persons with disabilities, and visible minorities.",
                id: "CR/mkO",
                description:
                  "Second paragraph for employment equity information.",
              })}
            </p>
            <p className="mb-3 font-bold">
              {intl.formatMessage({
                defaultMessage: "How will this data be used?",
                id: "ttRVSp",
                description:
                  "Heading for how employment equity information will be used.",
              })}
            </p>
            <Ul>
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
                    "This information will be used to match you with jobs that give preference to candidates from employment equity groups.",
                  id: "SlSHQo",
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
            </Ul>
            <p className="my-3">
              {intl.formatMessage({
                defaultMessage:
                  "If you do not want to share this information on this platform, <strong>there is no obligation</strong> to do so.",
                id: "WjCg7r",
                description:
                  "Third paragraph for employment equity information.",
              })}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <EquityOptions
        inApplication={!!pool}
        indigenousCommunities={user.indigenousCommunities}
        indigenousDeclarationSignature={user.indigenousDeclarationSignature}
        isVisibleMinority={user.isVisibleMinority}
        isWoman={user.isWoman}
        hasDisability={user.hasDisability}
        onAdd={(key: EquityKeys) => handleUpdate({ [key]: true })}
        onRemove={(key: EquityKeys) => handleUpdate({ [key]: false })}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default DiversityEquityInclusion;
