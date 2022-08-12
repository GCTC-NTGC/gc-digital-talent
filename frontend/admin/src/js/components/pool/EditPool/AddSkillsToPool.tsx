import * as React from "react";
import { useMemo, useState } from "react";
import { Skill, SkillCategory, SkillFamily } from "@common/api/generated";
import { useIntl } from "react-intl";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@common/components/Tabs";
import SkillFamilyPicker from "@common/components/skills/SkillFamilyPicker/SkillFamilyPicker";
import {
  filterSkillsByNameOrKeywords,
  invertSkillSkillFamilyTree,
} from "@common/helpers/skillUtils";
import { SkillResults } from "@common/components/skills/SkillResults/SkillResults";
import { SearchBar } from "@common/components/skills/SearchBar/SearchBar";
import Pagination, { usePaginationVars } from "@common/components/Pagination";
import Chip, { Chips } from "@common/components/Chip";
import { getLocalizedName } from "@common/helpers/localize";

const paginationPageSize = 5;

interface AddSkillsToPoolProps {
  selectedSkills: Array<Skill>;
  skills: Array<Skill>;
  onChangeSelectedSkills: (changedSelectedSkills: Array<Skill>) => void;
  idPrefix?: string;
  disabled?: boolean;
}

export const AddSkillsToPool = ({
  selectedSkills,
  skills,
  onChangeSelectedSkills,
  idPrefix,
  disabled,
}: AddSkillsToPoolProps): JSX.Element => {
  const intl = useIntl();

  const [selectedTechnicalSkillFamilyId, setSelectedTechnicalSkillFamilyId] =
    useState<SkillFamily["id"]>();
  const [
    selectedBehaviouralSkillFamilyId,
    setSelectedBehaviouralSkillFamilyId,
  ] = useState<SkillFamily["id"]>();
  const [searchQuery, setSearchQuery] = useState<string>();

  // this function can be a bit heavy
  const allSkillFamilies = useMemo(
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
    paginationPageSize,
    technicalSkillFamilyFilteredSkills,
  );
  const behaviouralSkillsFamilySkillsPagination = usePaginationVars<Skill>(
    paginationPageSize,
    technicalSkillFamilyFilteredSkills,
  );
  const searchSkillsPagination = usePaginationVars<Skill>(
    paginationPageSize,
    searchFilteredSkills,
  );

  const handleAddSkill = (id: Skill["id"]) => {
    const skillToAdd = skills.find((skill) => skill.id === id);
    if (skillToAdd) {
      onChangeSelectedSkills([...selectedSkills, skillToAdd]);
    }
  };

  const handleRemoveSkill = (id: Skill["id"]) => {
    onChangeSelectedSkills(selectedSkills.filter((skill) => skill.id !== id));
  };

  const tabs = [
    intl.formatMessage({
      defaultMessage: "Occupational skills",
      description: "Tab name for a list of occupational skills",
    }),
    intl.formatMessage({
      defaultMessage: "Transferable skills",
      description: "Tab name for a list of transferable skills",
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
                  setSelectedTechnicalSkillFamilyId(id);
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
                })}
                color="primary"
                mode="outline"
                currentPage={technicalSkillsFamilySkillsPagination.currentPage}
                pageSize={paginationPageSize}
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
                  defaultMessage: "All transferable skills",
                  description:
                    "The option label for 'no filter' on the list of transferable skills",
                })}
                skillFamilies={allSkillFamilies.filter(
                  (sf) => sf.category === SkillCategory.Behavioural,
                )}
                onSelectSkillFamily={(id) => {
                  setSelectedBehaviouralSkillFamilyId(id);
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
                })}
                color="primary"
                mode="outline"
                currentPage={
                  behaviouralSkillsFamilySkillsPagination.currentPage
                }
                pageSize={paginationPageSize}
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
                })}
                color="primary"
                mode="outline"
                currentPage={searchSkillsPagination.currentPage}
                pageSize={paginationPageSize}
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
            defaultMessage: "Selected essential skills ({skillCount})",
            description: "A title for an essential skill list",
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

export default AddSkillsToPool;
