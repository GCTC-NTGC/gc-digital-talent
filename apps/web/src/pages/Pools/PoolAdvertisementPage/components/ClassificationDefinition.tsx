import { useIntl } from "react-intl";
import { ReactNode, JSX } from "react";

import { GenericJobTitleKey } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";

import Text from "./Text";

const LevelOne = () => {
  const intl = useIntl();

  return (
    <Text className="my-0">
      {intl.formatMessage(
        {
          defaultMessage:
            "Technicians (<abbreviation>IT-01</abbreviation>) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
          id: "j3OROA",
          description: "blurb describing IT-01",
        },
        {
          abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
        },
      )}
    </Text>
  );
};

const LevelTwo = () => {
  const intl = useIntl();

  return (
    <Text className="my-0">
      {intl.formatMessage(
        {
          defaultMessage:
            "Analysts (<abbreviation>IT-02</abbreviation>) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> analysts are found in all work streams.",
          id: "/SLyVF",
          description: "blurb describing IT-02",
        },
        {
          abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
        },
      )}
    </Text>
  );
};

const LevelThreeLead = () => {
  const intl = useIntl();

  return (
    <>
      <Text className="mt-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of <abbreviation>IT-03</abbreviation> employees: those following a management path, and individual contributors.",
            id: "7wcfnG",
            description: "IT-03 description precursor",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
      <Text className="mb-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Management Path</strong>: <abbreviation>IT</abbreviation> Team Leads (<abbreviation>IT-03</abbreviation>) are responsible for supervising work and project teams for <abbreviation>IT</abbreviation> services and operations in their field of expertise to support service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> Team Leads are found in all work streams.",
            id: "t+WUYM",
            description: "IT-03 team lead path description",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
    </>
  );
};

const LevelThreeAdvisor = () => {
  const intl = useIntl();

  return (
    <>
      <Text className="mt-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of <abbreviation>IT-03</abbreviation> employees: those following a management path, and individual contributors.",
            id: "7wcfnG",
            description: "IT-03 description precursor",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
      <Text className="mb-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Individual Contributor</strong>: <abbreviation>IT</abbreviation> Technical Advisors (<abbreviation>IT-03</abbreviation>) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> Technical Advisors are found in all work streams.",
            id: "7xDPj5",
            description: "IT-03 advisor description",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
    </>
  );
};

const LevelFourManager = () => {
  const intl = useIntl();

  return (
    <>
      <Text className="mt-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of <abbreviation>IT-04</abbreviation> employees: those following a management path, and individual contributors.",
            id: "2aBKgf",
            description: "IT-04 description precursor",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
      <Text className="mb-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Management Path</strong>: <abbreviation>IT</abbreviation> Managers (<abbreviation>IT-04</abbreviation>) are responsible for managing the development and delivery of <abbreviation>IT</abbreviation> services and/or operations through subordinate team leaders, technical advisors, and project teams, for service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> Managers are found in all work streams.",
            id: "YVuyjO",
            description: "IT-04 manager path description",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
    </>
  );
};

const LevelFourAdvisor = (): JSX.Element => {
  const intl = useIntl();

  return (
    <>
      <Text className="mt-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two types of <abbreviation>IT-04</abbreviation> employees: those following a management path, and individual contributors.",
            id: "2aBKgf",
            description: "IT-04 description precursor",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
      <Text className="mb-0">
        {intl.formatMessage(
          {
            defaultMessage:
              "<strong>Individual Contributor</strong>: <abbreviation>IT</abbreviation> Senior Advisors (<abbreviation>IT-04</abbreviation>) provide expert technical advice and strategic direction in their field of expertise in the provision of solutions and services to internal or external clients, and stakeholders.",
            id: "NeR+6V",
            description:
              "IT-04 senior advisor description precursor to work stream list",
          },
          {
            abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </Text>
    </>
  );
};

interface ClassificationDefinitionProps {
  name: string;
}

const definitionMap: Record<string, () => JSX.Element> = {
  [GenericJobTitleKey.TechnicianIt01]: LevelOne,
  [GenericJobTitleKey.AnalystIt02]: LevelTwo,
  [GenericJobTitleKey.TeamLeaderIt03]: LevelThreeLead,
  [GenericJobTitleKey.TechnicalAdvisorIt03]: LevelThreeAdvisor,
  [GenericJobTitleKey.SeniorAdvisorIt04]: LevelFourAdvisor,
  [GenericJobTitleKey.ManagerIt04]: LevelFourManager,
};

const ClassificationDefinition = ({ name }: ClassificationDefinitionProps) => {
  if (!name) {
    return null;
  }

  const El = definitionMap[name];
  return <El />;
};

export default ClassificationDefinition;
