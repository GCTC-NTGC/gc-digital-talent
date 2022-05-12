import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { Scalars, Skill, SkillFamily } from "@common/api/generated";
import { Tab, TabSet } from "@common/components/tabs";
import {
  FilterIcon,
  SearchCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import { matchStringCaseDiacriticInsensitive } from "@common/helpers/formUtils";
import Pagination, { usePaginationVars } from "@common/components/Pagination";
import { invertSkillTree } from "@common/helpers/skillUtils";
import AddedSkills from "../AddedSkills";
import SkillResults from "../SkillResults";
import SkillChecklist from "../SkillChecklist";
import SearchBar from "../SearchBar";

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
  const locale = getLocale(intl);

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
      const matchedSkills = allSkills.filter((skill) =>
        matchStringCaseDiacriticInsensitive(
          searchQuery,
          skill.name[locale] ?? "",
        ),
      );
      setSearchFilteredSkills(matchedSkills);
      keywordSearchPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
      resolve();
    });
  };

  // this function can be a bit heavy
  const allSkillFamilies = useMemo(
    () => invertSkillTree(allSkills),
    [allSkills],
  );

  return (
    <>
      <AddedSkills skills={addedSkills} onRemoveSkill={onRemoveSkill} />
      <hr />
      <h5>
        {intl.formatMessage({
          defaultMessage: "Add Skills",
          description: "Section header for adding skills to this experience",
        })}
      </h5>
      <TabSet>
        <Tab
          icon={<SearchCircleIcon style={{ width: "1rem" }} />}
          text={intl.formatMessage({
            defaultMessage: "My frequent skills",
            description: "Tab name for a list of frequently used skills",
          })}
        >
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
            addedSkills={addedSkills}
            handleAddSkill={onAddSkill}
            handleRemoveSkill={onRemoveSkill}
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
            handlePageChange={(page) =>
              frequentSkillsPagination.setCurrentPage(page)
            }
            handlePageSize={frequentSkillsPagination.setPageSize}
          />
        </Tab>
        <Tab
          icon={<FilterIcon style={{ width: "1rem" }} />}
          text={intl.formatMessage({
            defaultMessage: "Mainstream skills",
            description: "Tab name for a list of mainstream skills",
          })}
        >
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
            addedSkills={addedSkills}
            handleAddSkill={onAddSkill}
            handleRemoveSkill={onRemoveSkill}
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
            handlePageChange={(page) =>
              mainstreamSkillsPagination.setCurrentPage(page)
            }
            handlePageSize={mainstreamSkillsPagination.setPageSize}
          />
        </Tab>
        <Tab
          icon={<SearchCircleIcon style={{ width: "1rem" }} />}
          text={intl.formatMessage({
            defaultMessage: "Search by keyword",
            description: "Tab name for a box to search for skills",
          })}
        >
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
            addedSkills={addedSkills}
            handleAddSkill={onAddSkill}
            handleRemoveSkill={onRemoveSkill}
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
            handlePageChange={(page) =>
              keywordSearchPagination.setCurrentPage(page)
            }
            handlePageSize={keywordSearchPagination.setPageSize}
          />
        </Tab>
        <Tab
          tabType="closer"
          iconPosition="right"
          iconOpen={<ChevronUpIcon style={{ width: "1.25rem" }} />}
          textOpen="Close"
          iconClosed={<ChevronDownIcon style={{ width: "1.25rem" }} />}
          textClosed="Open"
          placement="end"
        />
      </TabSet>
    </>
  );
};

export default AddSkillsToExperience;
