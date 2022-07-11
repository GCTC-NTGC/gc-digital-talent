import React from "react";
import { GenericJobTitleKey } from "../../api/generated";

import ITDefinitions from "./ITDefinitions";

interface ClassificationDefinitionProps {
  name: string;
}

const definitionMap: Record<string, React.FC> = {
  [GenericJobTitleKey.TechnicianIt01]: ITDefinitions.LevelOne,
  [GenericJobTitleKey.AnalystIt02]: ITDefinitions.LevelTwo,
  [GenericJobTitleKey.TeamLeaderIt03]: ITDefinitions.LevelThreeLead,
  [GenericJobTitleKey.TechnicalAdvisorIt03]: ITDefinitions.LevelThreeLead,
  [GenericJobTitleKey.SeniorAdvisorIt04]: ITDefinitions.LevelFourAdvisor,
  [GenericJobTitleKey.ManagerIt04]: ITDefinitions.LevelFourManager,
};

const ClassificationDefinition = ({ name }: ClassificationDefinitionProps) => {
  if (!name) {
    return null;
  }

  const El = definitionMap[name];
  return <El />;
};

export default ClassificationDefinition;
