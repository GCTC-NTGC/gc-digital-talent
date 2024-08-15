import { useIntl } from "react-intl";

import { Chip, Chips } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import adminMessages from "~/messages/adminMessages";

const ViewTeamPage_TeamFragment = graphql(/* GraphQL */ `
  fragment ViewTeamPage_Team on Team {
    id
    name
    contactEmail
    displayName {
      en
      fr
    }
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    description {
      en
      fr
    }
  }
`);

export type ViewTeamPageFragment = FragmentType<
  typeof ViewTeamPage_TeamFragment
>;

interface ViewTeamProps {
  teamQuery: ViewTeamPageFragment;
}

const ViewTeam = ({ teamQuery }: ViewTeamProps) => {
  const intl = useIntl();
  const team = getFragment(ViewTeamPage_TeamFragment, teamQuery);

  const departments = unpackMaybes(team.departments);

  return (
    <>
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
              defaultMessage: "Team's name (English)",
              id: "rdYjIb",
              description: "Name of an organization/team in English field.",
            })}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.displayName?.en ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p>
            {intl.formatMessage({
              defaultMessage: "Team's name (French)",
              id: "YjMfWZ",
              description: "Name of an organization/team in French field.",
            })}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.displayName?.fr ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1)">
          <p data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage(adminMessages.departments)}
          </p>
          {departments.length > 0 ? (
            <Chips>
              {departments.map((department) => (
                <Chip color="primary" key={department.id}>
                  {getLocalizedName(department.name, intl)}
                </Chip>
              ))}
            </Chips>
          ) : null}
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage(adminMessages.key)}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team.name}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage(commonMessages.email)}
          </p>
          <p
            data-h2-color="base:all(black)"
            data-h2-background-color="base:all(gray.light)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
          >
            <span>{team?.contactEmail ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Team's short description (English)",
              id: "sSGgnI",
              description: "Label for team description in English language",
            })}
          </p>
          <p
            data-h2-background-color="base(white)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
            data-h2-min-height="base(x6)"
          >
            <span>{team?.description?.en ?? ""}</span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage({
              defaultMessage: "Team's short description (French)",
              id: "RSkJQR",
              description: "Label for team description in French language",
            })}
          </p>
          <p
            data-h2-background-color="base(white)"
            data-h2-margin="base(x.25, 0, x1, 0)"
            data-h2-padding="base(x.25, 0, x.25, x.5)"
            data-h2-border="base(2px solid gray)"
            data-h2-radius="base(rounded)"
            data-h2-min-height="base(x6)"
          >
            <span>{team?.description?.fr ?? ""}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ViewTeam;
