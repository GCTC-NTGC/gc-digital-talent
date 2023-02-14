import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Team } from "~/api/generated";
import { Input, TextArea } from "@common/components/form";
import Pill from "@common/components/Pill/Pill";
import useLocale from "~/../../../frontend/common/src/hooks/useLocale";

interface ViewTeamProps {
  team: Team;
}

export const ViewTeam = ({ team }: ViewTeamProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const form = useForm();

  const departmentsPillsArray =
    team?.departments && team.departments.length > 0
      ? team.departments.map((department) => {
          return (
            <Pill color="primary" mode="outline" key={department?.id}>
              {department?.name?.[locale]}
            </Pill>
          );
        })
      : null;

  return (
    <FormProvider {...form}>
      <h2 data-h2-margin="base(x2, 0, 0, 0)" data-h2-font-size="base(h3)">
        {intl.formatMessage({
          defaultMessage: "Basic information",
          id: "Rg0SpL",
          description: "Basic information",
        })}
      </h2>
      <div data-h2-flex-grid="base(flex-start, x1, 0)">
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="displayNameEnglish"
            name="displayNameEnglish"
            type="text"
            readOnly
            hideOptional
            value={team.displayName?.en ?? ""}
            label={intl.formatMessage({
              defaultMessage: "Organization's name (English)",
              id: "DziQ2u",
              description:
                "Label displayed on the organization name in English field.",
            })}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="displayNameFrench"
            name="displayNameFrench"
            type="text"
            readOnly
            hideOptional
            value={team.displayName?.fr ?? ""}
            label={intl.formatMessage({
              defaultMessage: "Organization's name (French)",
              id: "oTWaul",
              description:
                "Label displayed on the organization name in French field.",
            })}
          />
        </div>
        <div data-h2-flex-item="base(1of1)">
          <p data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage({
              defaultMessage: "Departments",
              id: "457hEW",
              description:
                "Heading displayed above the Department Table component.",
            })}
          </p>
          {departmentsPillsArray}
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="key"
            name="key"
            type="text"
            readOnly
            hideOptional
            value={team.name}
            label={intl.formatMessage({
              defaultMessage: "Key",
              id: "i8zhiL",
              description: "Key",
            })}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="contactEmail"
            name="contactEmail"
            type="text"
            readOnly
            hideOptional
            value={team.contactEmail ?? ""}
            label={intl.formatMessage({
              defaultMessage: "Contact email",
              id: "nGNj5Q",
              description: "Contact email",
            })}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <TextArea
            id="teamDescriptionEnglish"
            name="teamDescriptionEnglish"
            readOnly
            hideOptional
            value={team.description?.en ?? ""}
            label={intl.formatMessage({
              defaultMessage: "Team's short description (English)",
              id: "whsH/g",
              description: "Short description for a team in English",
            })}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <TextArea
            id="teamDescriptionFrench"
            name="teamDescriptionFrench"
            readOnly
            hideOptional
            value={team.description?.fr ?? ""}
            label={intl.formatMessage({
              defaultMessage: "Team's short description (French)",
              id: "PtbLq+",
              description: "Short description for a team in French",
            })}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default ViewTeam;
