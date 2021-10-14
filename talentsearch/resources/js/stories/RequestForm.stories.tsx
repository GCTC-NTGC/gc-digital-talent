import React from "react";
import { storiesOf } from "@storybook/react";
import { fakePoolCandidateFilters } from "@common/fakeData";
import { PoolCandidateFilter } from "@common/api/generated";
import SummaryOfFilters from "../components/requestForm/SummaryOfFilters";
import { LanguageAbility } from "../api/generated";

const stories = storiesOf("Request Form Page", module);

stories.add("Summary of Filters", () => {
  const poolCandidateFilter: PoolCandidateFilter =
    fakePoolCandidateFilters()[0] as PoolCandidateFilter;
  const classifications: string[] | undefined =
    poolCandidateFilter.classifications?.map(
      (classification) =>
        `${classification?.group.toLocaleUpperCase()}-0${
          classification?.level
        }`,
    );
  const educationLevel: string | undefined = poolCandidateFilter.hasDiploma
    ? "Required diploma from post-secondary institution"
    : "Can accept a combination of work experience and education";
  const employmentEquity: string[] | undefined = ["Woman", "Visible Minority"];
  const operationalRequirements: string[] | undefined =
    poolCandidateFilter.operationalRequirements?.map(
      (operationalRequirement) =>
        operationalRequirement?.name.en || "operational requirement",
    );
  const skills: string[] | undefined = poolCandidateFilter.cmoAssets?.map(
    (cmoAsset) => cmoAsset?.name.en || "cmo asset",
  );
  const typeOfOpportunity = "Indeterminate position";
  const workLocation: string[] = poolCandidateFilter.workRegions as string[];
  return (
    <SummaryOfFilters
      classifications={classifications}
      educationLevel={educationLevel}
      employmentEquity={employmentEquity}
      languageAbility={LanguageAbility.Bilingual}
      operationalRequirements={operationalRequirements}
      skills={skills}
      totalEstimatedCandidates={12}
      typeOfOpportunity={typeOfOpportunity}
      workLocation={workLocation}
    />
  );
});
