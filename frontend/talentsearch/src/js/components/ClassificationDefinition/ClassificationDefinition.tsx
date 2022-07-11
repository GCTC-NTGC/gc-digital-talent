import React from "react";
import { GenericJobTitleKey } from "../../api/generated";

import ITDefinitions from "./ITDefinitions";

interface ClassificationDefinitionProps {
  group: string;
  level: number;
  name?: string;
}

const definitionMap: Record<
  string,
  Record<number, Record<string, React.FC>>
> = {
  IT: {
    1: {
      [GenericJobTitleKey.TechnicianIt01]: ITDefinitions.LevelOne,
    },
    2: { [GenericJobTitleKey.AnalystIt02]: ITDefinitions.LevelTwo },
    3: {
      [GenericJobTitleKey.TeamLeaderIt03]: ITDefinitions.LevelThreeLead,
      [GenericJobTitleKey.TechnicalAdvisorIt03]: ITDefinitions.LevelThreeLead,
    },
    4: {
      [GenericJobTitleKey.SeniorAdvisorIt04]: ITDefinitions.LevelFourAdvisor,
      [GenericJobTitleKey.ManagerIt04]: ITDefinitions.LevelFourManager,
    },
  },
};

const ClassificationDefinition = ({
  group,
  level,
  name,
}: ClassificationDefinitionProps) => {
  if (!name) {
    return null;
  }

  const El = definitionMap[group] ? definitionMap[group][level][name] : null;

  if (El) {
    return <El />;
  }

  return null;
};

export default ClassificationDefinition;
