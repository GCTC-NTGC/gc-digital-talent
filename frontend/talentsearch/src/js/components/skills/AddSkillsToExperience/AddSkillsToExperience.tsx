import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Scalars, Skill, SkillFamily } from "@common/api/generated";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@common/components/Tabs";
import Pagination, { usePaginationVars } from "@common/components/Pagination";
import {
  filterSkillsByNameOrKeywords,
  invertSkillSkillFamilyTree,
} from "@common/helpers/skillUtils";
import SearchBar from "@common/components/skills/SearchBar";
import SkillResults from "@common/components/skills/SkillResults";
import AddedSkills from "../AddedSkills";
import SkillChecklist from "../SkillChecklist";

export interface AddSkillsToExperienceProps {
  allSkills: Skill[];
  frequentSkills: Skill[];
  addedSkills: Skill[];
  onRemoveSkill: (id: Scalars["ID"]) => void;
  onAddSkill: (id: Scalars["ID"]) => void;
}

const AddSkillsToExperience: React.FunctionComponent<
  AddSkillsToExperienceProps
> = ({ allSkills, frequentSkills, addedSkills, onRemoveSkill, onAddSkill }) => {
  const intl = useIntl();

  const [familyFilteredSkills, setFamilyFilteredSkills] = useState<Skill[]>([]);
  const [searchFilteredSkills, setSearchFilteredSkills] = useState<Skill[]>([]);

  const resultsPaginationPageSize = 5;
  const frequentSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    frequentSkills,
  );
  const mainstreamSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    familyFilteredSkills,
  );
  const keywordSearchPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    searchFilteredSkills,
  );

  /**
   * A handler which takes a list of skill families and filters the allSkills list to
   * any skills that are a part of those families.  Applies the filter
   * internally using the useState hook.
   * @param {SkillFamily[]} checkedFamilies - The selected skill families to filter against.
   */
  const handleSkillFamilyChange = (checkedFamilies: SkillFamily[]): void => {
    const checkedFamilyIds = checkedFamilies.map((family) => family.id);
    const matchingSkills = allSkills.filter((skill) =>
      // https://stackoverflow.com/a/39893636
      skill.families?.some((skillFamily) =>
        checkedFamilyIds.includes(skillFamily.id),
      ),
    );
    setFamilyFilteredSkills(matchingSkills);
    mainstreamSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
  };

  /**
   * A handler which takes a search query and uses a matching function to filter
   * a list of skills.  Applies the filter internally using the useState hook.
   * @param {string} searchQuery - The search text to filter against.
   */
  const handleSearch = (searchQuery: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      const matchedSkills = filterSkillsByNameOrKeywords(
        allSkills,
        searchQuery,
        intl,
      );
      setSearchFilteredSkills(matchedSkills);
      keywordSearchPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
      resolve();
    });
  };

  // this function can be a bit heavy
  const allSkillFamilies = useMemo(
    () => invertSkillSkillFamilyTree(allSkills),
    [allSkills],
  );

  const tabs = [
    intl.formatMessage({
      defaultMessage: "My frequent skills",
      description: "Tab name for a list of frequently used skills",
    }),
    intl.formatMessage({
      defaultMessage: "Mainstream skills",
      description: "Tab name for a list of mainstream skills",
    }),
    intl.formatMessage({
      defaultMessage: "Search by keyword",
      description: "Tab name for a box to search for skills",
    }),
  ];

  return (
    <>
      <AddedSkills skills={addedSkills || []} onRemoveSkill={onRemoveSkill} />
      <hr />
      <h4>
        {intl.formatMessage({
          defaultMessage: "Add Skills",
          description: "Section header for adding skills to this experience",
        })}
      </h4>
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
            <SkillResults
              title={intl.formatMessage(
                {
                  defaultMessage: "Frequently used skills ({skillCount})",
                  description:
                    "Section header for a list of frequently used skills",
                },
                {
                  skillCount: frequentSkills.length,
                },
              )}
              skills={frequentSkillsPagination.currentTableData}
              addedSkills={addedSkills || []}
              onAddSkill={onAddSkill}
              onRemoveSkill={onRemoveSkill}
            />
            <Pagination
              ariaLabel={intl.formatMessage({
                defaultMessage: "Frequent skills results",
              })}
              color="primary"
              mode="outline"
              currentPage={frequentSkillsPagination.currentPage}
              pageSize={resultsPaginationPageSize}
              totalCount={frequentSkills.length}
              onPageSizeChange={(page) =>
                frequentSkillsPagination.setCurrentPage(page)
              }
              onCurrentPageChange={frequentSkillsPagination.setPageSize}
            />
          </TabPanel>
          <TabPanel>
            <SkillChecklist
              skillFamilies={allSkillFamilies}
              callback={handleSkillFamilyChange}
            />
            <SkillResults
              title={intl.formatMessage(
                {
                  defaultMessage: "Results ({skillCount})",
                  description: "A title for a skill list of results",
                },
                {
                  skillCount: familyFilteredSkills.length,
                },
              )}
              skills={mainstreamSkillsPagination.currentTableData}
              addedSkills={addedSkills || []}
              onAddSkill={onAddSkill}
              onRemoveSkill={onRemoveSkill}
            />
            <Pagination
              ariaLabel={intl.formatMessage({
                defaultMessage: "Mainstream skills results",
              })}
              color="primary"
              mode="outline"
              currentPage={mainstreamSkillsPagination.currentPage}
              pageSize={resultsPaginationPageSize}
              totalCount={familyFilteredSkills.length}
              onCurrentPageChange={(page) =>
                mainstreamSkillsPagination.setCurrentPage(page)
              }
              onPageSizeChange={mainstreamSkillsPagination.setPageSize}
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
              skills={keywordSearchPagination.currentTableData}
              addedSkills={addedSkills || []}
              onAddSkill={onAddSkill}
              onRemoveSkill={onRemoveSkill}
            />
            <Pagination
              ariaLabel={intl.formatMessage({
                defaultMessage: "keyword search skills results",
              })}
              color="primary"
              mode="outline"
              currentPage={keywordSearchPagination.currentPage}
              pageSize={resultsPaginationPageSize}
              totalCount={searchFilteredSkills.length}
              onCurrentPageChange={(page) =>
                keywordSearchPagination.setCurrentPage(page)
              }
              onPageSizeChange={keywordSearchPagination.setPageSize}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default AddSkillsToExperience;
