import React from "react";
import { useIntl } from "react-intl";
import Chip, { Chips } from "../../Chip";
import Pagination, { usePaginationVars } from "../../Pagination";
import SearchBar from "../SearchBar";
import SkillResults from "../SkillResults";
import SkillFamilyPicker from "../SkillFamilyPicker";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "../../Tabs";
import { SkillCategory } from "../../../api/generated";
import type { Skill, SkillFamily } from "../../../api/generated";

import {
  filterSkillsByNameOrKeywords,
  invertSkillSkillFamilyTree,
} from "../../../helpers/skillUtils";
import { getLocalizedName } from "../../../helpers/localize";

const PAGE_SIZE = 5;

export interface SkillPickerProps {
  selectedSkills: Array<Skill>;
  skills: Array<Skill>;
  onChange: (newSkills: Array<Skill>) => void;
  idPrefix?: string;
  disabled?: boolean;
}

const SkillPicker = ({
  selectedSkills,
  skills,
  onChange,
  idPrefix,
  disabled,
}: SkillPickerProps): JSX.Element => {
  const intl = useIntl();

  const [selectedTechnicalSkillFamilyId, setSelectedTechnicalSkillFamilyId] =
    React.useState<SkillFamily["id"] | null>(null);
  const [
    selectedBehaviouralSkillFamilyId,
    setSelectedBehaviouralSkillFamilyId,
  ] = React.useState<SkillFamily["id"] | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // this function can be a bit heavy
  const allSkillFamilies = React.useMemo(
    () => invertSkillSkillFamilyTree(skills),
    [skills],
  );

  const technicalSkillFamilyFilteredSkills = selectedTechnicalSkillFamilyId
    ? // we have a skill family Id to check
      skills.filter((skill) =>
        skill?.families?.some(
          (family) => family.id === selectedTechnicalSkillFamilyId,
        ),
      )
    : // no skill family id to check -> match any technical skill family
      skills.filter((skill) =>
        skill?.families?.some(
          (family) => family.category === SkillCategory.Technical,
        ),
      );
  const behaviouralSkillFamilyFilteredSkills = selectedBehaviouralSkillFamilyId
    ? // we have a skill family Id to check
      skills.filter((skill) =>
        skill?.families?.some(
          (family) => family.id === selectedBehaviouralSkillFamilyId,
        ),
      )
    : // no skill family id to check -> match any behavioural skill family
      skills.filter((skill) =>
        skill?.families?.some(
          (family) => family.category === SkillCategory.Behavioural,
        ),
      );
  const searchFilteredSkills = searchQuery
    ? // we have a search query to check
      filterSkillsByNameOrKeywords(skills, searchQuery, intl)
    : // no search query -> match all skills
      skills;

  const technicalSkillsFamilySkillsPagination = usePaginationVars<Skill>(
    PAGE_SIZE,
    technicalSkillFamilyFilteredSkills,
  );
  const behaviouralSkillsFamilySkillsPagination = usePaginationVars<Skill>(
    PAGE_SIZE,
    behaviouralSkillFamilyFilteredSkills,
  );
  const searchSkillsPagination = usePaginationVars<Skill>(
    PAGE_SIZE,
    searchFilteredSkills,
  );

  const handleAddSkill = (id: Skill["id"]) => {
    const skillToAdd = skills.find((skill) => skill.id === id);
    if (skillToAdd) {
      onChange([...selectedSkills, skillToAdd]);
    }
  };

  const handleRemoveSkill = (id: Skill["id"]) => {
    onChange(selectedSkills.filter((skill) => skill.id !== id));
  };

  const tabs = [
    intl.formatMessage({
      defaultMessage: "Technical skills",
      description: "Tab name for a list of technical skills",
    }),
    intl.formatMessage({
      defaultMessage: "Behavioural skills",
      description: "Tab name for a list of behavioural skills",
    }),
    intl.formatMessage({
      defaultMessage: "By keyword",
      description: "Tab name for a box to search for skills",
    }),
  ];

  const handleSearch = (newSearchQuery: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      setSearchQuery(newSearchQuery);
      searchSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
      resolve();
    });
  };

  return (
    <>
      {!disabled && (
        <Tabs>
          <TabList>
            {tabs.map((tab, index) => (
              <Tab key={tab} index={index}>
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              <SkillFamilyPicker
                title={intl.formatMessage({
                  defaultMessage: "Skill groups",
                  description: "A title for a list of skill families",
                })}
                nullSelectionLabel={intl.formatMessage({
                  defaultMessage: "All technical skills",
                  description:
                    "The option label for 'no filter' on the list of occupational skills",
                })}
                skillFamilies={allSkillFamilies.filter(
                  (sf) => sf.category === SkillCategory.Technical,
                )}
                onSelectSkillFamily={(id) => {
                  setSelectedTechnicalSkillFamilyId(id || null);
                  technicalSkillsFamilySkillsPagination.setCurrentPage(1);
                }}
                idPrefix={`${idPrefix}-technical`}
              />
              <SkillResults
                title={intl.formatMessage(
                  {
                    defaultMessage: "Results ({skillCount})",
                    description: "A title for a skill list of results",
                  },
                  {
                    skillCount: technicalSkillFamilyFilteredSkills.length,
                  },
                )}
                skills={technicalSkillsFamilySkillsPagination.currentTableData}
                addedSkills={selectedSkills}
                onAddSkill={(id) => handleAddSkill(id)}
                onRemoveSkill={(id) => handleRemoveSkill(id)}
              />
              <Pagination
                ariaLabel={intl.formatMessage({
                  defaultMessage: "Mainstream skills results",
                  description:
                    "Accessibility label for a result set of skills, filtered to mainstream skills",
                })}
                color="primary"
                mode="outline"
                currentPage={technicalSkillsFamilySkillsPagination.currentPage}
                pageSize={PAGE_SIZE}
                totalCount={technicalSkillFamilyFilteredSkills.length}
                onCurrentPageChange={(page) =>
                  technicalSkillsFamilySkillsPagination.setCurrentPage(page)
                }
                onPageSizeChange={
                  technicalSkillsFamilySkillsPagination.setPageSize
                }
              />
            </TabPanel>
            <TabPanel>
              <SkillFamilyPicker
                title={intl.formatMessage({
                  defaultMessage: "Skill groups",
                  description: "A title for a list of skill families",
                })}
                nullSelectionLabel={intl.formatMessage({
                  defaultMessage: "All behavioural skills",
                  description:
                    "The option label for 'no filter' on the list of behavioural skills",
                })}
                skillFamilies={allSkillFamilies.filter(
                  (sf) => sf.category === SkillCategory.Behavioural,
                )}
                onSelectSkillFamily={(id) => {
                  setSelectedBehaviouralSkillFamilyId(id || null);
                  behaviouralSkillsFamilySkillsPagination.setCurrentPage(1);
                }}
                idPrefix={`${idPrefix}-behavioural`}
              />
              <SkillResults
                title={intl.formatMessage(
                  {
                    defaultMessage: "Results ({skillCount})",
                    description: "A title for a skill list of results",
                  },
                  {
                    skillCount: behaviouralSkillFamilyFilteredSkills.length,
                  },
                )}
                skills={
                  behaviouralSkillsFamilySkillsPagination.currentTableData
                }
                addedSkills={selectedSkills}
                onAddSkill={(id) => handleAddSkill(id)}
                onRemoveSkill={(id) => handleRemoveSkill(id)}
              />
              <Pagination
                ariaLabel={intl.formatMessage({
                  defaultMessage: "Mainstream skills results",
                  description:
                    "Accessibility label for a result set of skills, filtered to mainstream skills",
                })}
                color="primary"
                mode="outline"
                currentPage={
                  behaviouralSkillsFamilySkillsPagination.currentPage
                }
                pageSize={PAGE_SIZE}
                totalCount={behaviouralSkillFamilyFilteredSkills.length}
                onCurrentPageChange={(page) =>
                  behaviouralSkillsFamilySkillsPagination.setCurrentPage(page)
                }
                onPageSizeChange={
                  behaviouralSkillsFamilySkillsPagination.setPageSize
                }
              />
            </TabPanel>
            <TabPanel>
              <SearchBar handleSearch={handleSearch} />
              <SkillResults
                title={intl.formatMessage(
                  {
                    defaultMessage: "Results ({skillCount})",
                    description: "A title for a list of results",
                  },
                  {
                    skillCount: searchFilteredSkills.length,
                  },
                )}
                skills={searchSkillsPagination.currentTableData}
                addedSkills={selectedSkills}
                onAddSkill={(id) => handleAddSkill(id)}
                onRemoveSkill={(id) => handleRemoveSkill(id)}
              />
              <Pagination
                ariaLabel={intl.formatMessage({
                  defaultMessage: "keyword search skills results",
                  description:
                    "Accessibility label for a result set of skills, searched by keyword",
                })}
                color="primary"
                mode="outline"
                currentPage={searchSkillsPagination.currentPage}
                pageSize={PAGE_SIZE}
                totalCount={searchFilteredSkills.length}
                onCurrentPageChange={(page) =>
                  searchSkillsPagination.setCurrentPage(page)
                }
                onPageSizeChange={searchSkillsPagination.setPageSize}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage: "Selected skills ({skillCount})",
            description: "A title for an skill list",
          },
          {
            skillCount: selectedSkills.length,
          },
        )}
      </p>
      <div data-h2-margin="base(x1, 0)">
        <Chips>
          {selectedSkills.map((skill) => {
            return (
              <Chip
                key={skill.id}
                label={getLocalizedName(skill.name, intl)}
                color="primary"
                mode="outline"
                onDismiss={
                  !disabled ? () => handleRemoveSkill(skill.id) : undefined
                }
              />
            );
          })}
        </Chips>
      </div>
    </>
  );
};

export default SkillPicker;
