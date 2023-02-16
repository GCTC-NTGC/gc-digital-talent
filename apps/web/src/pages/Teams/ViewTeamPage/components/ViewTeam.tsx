import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Team } from "~/api/generated";
import { Input, TextArea } from "@common/components/form";
import Pill from "@common/components/Pill/Pill";
import { getLocalizedName } from "@common/helpers/localize";

interface ViewTeamProps {
  team: Team;
}

export const ViewTeam = ({ team }: ViewTeamProps) => {
  const intl = useIntl();
  const form = useForm();

  const departmentsPillsArray =
    team?.departments && team.departments.length > 0
      ? team.departments.map((department) => {
          return (
            <Pill color="primary" mode="outline" key={department?.id}>
              {getLocalizedName(department?.name, intl)}
            </Pill>
          );
        })
      : null;

  return (
    <FormProvider {...form}>
      <h2 data-h2-margin="base(x2, 0, x1, 0)" data-h2-font-size="base(h3)">
        {intl.formatMessage({
          defaultMessage: "Basic information",
          id: "Rg0SpL",
          description: "Basic information",
        })}
      </h2>
      <div data-h2-flex-grid="base(flex-start, x1, 0)">
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p>
            {intl.formatMessage({
              defaultMessage: "Organization's name (English)",
              id: "QC23B1",
              description: "Name of an organization/team in English field.",
            })}
          </p>
          <p
            data-h2-background-color="base(dt-gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid dt-gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.displayName?.en ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p>
            {intl.formatMessage({
              defaultMessage: "Organization's name (French)",
              id: "W0BVd+",
              description: "Name of an organization/team in French field.",
            })}
          </p>
          <p
            data-h2-background-color="base(dt-gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid dt-gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.displayName?.fr ?? ""}</span>
          </p>
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
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Key",
              id: "CvV2l6",
              description: "Label for an entity 'key' field",
            })}
          </p>
          <p
            data-h2-background-color="base(dt-gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid dt-gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.name}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Contact email",
              id: "nGNj5Q",
              description: "Contact email",
            })}
          </p>
          <p
            data-h2-background-color="base(dt-gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid dt-gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team?.contactEmail ?? ""}</span>
          </p>
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
