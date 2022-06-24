import React from "react";
import { useIntl } from "react-intl";

import { Skill, SkillCategory, SkillFamily } from "@common/api/generated";
import Pagination, { usePaginationVars } from "@common/components/Pagination";
import { matchStringCaseDiacriticInsensitive } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { Tab, TabSet } from "@common/components/tabs";
import { invertSkillTree } from "@common/helpers/skillUtils";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useFieldArray, useFormContext } from "react-hook-form";
import { notEmpty } from "@common/helpers/util";
import SkillResults from "../SkillResults";
import SkillFamiliesRadioList from "../SkillFamiliesRadioList/SkillFamiliesRadioList";
import AddedSkills from "../AddedSkills";
import SearchBar from "../SearchBar";

export interface AddSkillsToFilterProps {
  allSkills: Skill[];
}

const AddSkillsToFilter: React.FC<AddSkillsToFilterProps> = ({ allSkills }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { control, watch } = useFormContext();
  const watchedSkills = watch("skills");
  const { append, remove } = useFieldArray({
    control,
    name: "skills",
  });
  const [addedSkillIds, setAddedSkillIds] = React.useState<string[]>(
    watchedSkills || [],
  );

  const [technicalSkills, setTechnicalSkills] = React.useState<Skill[]>([]);
  const [filteredTechnicalSkills, setFilteredTechnicalSkills] = React.useState<
    Skill[]
  >([]);
  const [transferableSkills, setTransferableSkills] = React.useState<Skill[]>(
    [],
  );
  const [filteredTransferableSkills, setFilteredTransferableSkills] =
    React.useState<Skill[]>([]);
  const [searchSkills, setSearchSkills] = React.useState<Skill[]>([]);

  const addedSkills: Skill[] = React.useMemo(() => {
    return addedSkillIds
      .map((id) => allSkills.find((skill) => skill.id === id))
      .filter((skill) => typeof skill !== "undefined") as Skill[];
  }, [addedSkillIds, allSkills]);

  React.useEffect(() => {
    const technical = allSkills.filter((skill) => {
      return skill.families?.some((family) => {
        return family.category === SkillCategory.Technical;
      });
    });
    setTechnicalSkills(technical);
    const transferable = allSkills.filter((skill) => {
      return skill.families?.some((family) => {
        return family.category === SkillCategory.Behavioural;
      });
    });
    setTransferableSkills(transferable);
  }, [allSkills, setTechnicalSkills, setTransferableSkills]);

  React.useEffect(() => {
    const newSkills = notEmpty(watchedSkills)
      ? watchedSkills.map((watchedSkill: string) => {
          const newSkill = allSkills.find((s) => s.id === watchedSkill);
          return newSkill?.id || undefined;
        })
      : [];
    setAddedSkillIds(newSkills.length > 0 ? newSkills : []);
  }, [watchedSkills, setAddedSkillIds, allSkills]);

  const handleAddSkill = (id: string) => {
    append(id);
  };

  const handleRemoveSkill = (id: string) => {
    const index = watchedSkills.findIndex((field: string) => field === id);
    if (index >= 0) {
      remove(index);
    }
  };

  const resultsPaginationPageSize = 5;
  const technicalSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    filteredTechnicalSkills,
  );
  const transferableSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    filteredTransferableSkills,
  );
  const searchSkillsPagination = usePaginationVars<Skill>(
    resultsPaginationPageSize,
    searchSkills,
  );

  /**
   * A handler which takes a list of skill families and filters the allSkills list to
   * any skills that are a part of those families.  Applies the filter
   * internally using the useState hook.
   * @param {SkillFamily[]} checkedFamilies - The selected skill families to filter against.
   */
  const handleSkillFamilyChange = (
    checkedFamily: SkillFamily | null,
    category: SkillCategory,
  ): void => {
    let skills = technicalSkills;
    let set = setFilteredTechnicalSkills;
    if (category === SkillCategory.Behavioural) {
      skills = transferableSkills;
      set = setFilteredTransferableSkills;
    }
    if (!checkedFamily) {
      set(skills);
    }

    const matchingSkills = skills.filter((skill) =>
      // https://stackoverflow.com/a/39893636
      skill.families?.some(
        (skillFamily) => checkedFamily?.id === skillFamily.id,
      ),
    );
    set(matchingSkills);
    technicalSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
    transferableSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
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
      setSearchSkills(matchedSkills);
      searchSkillsPagination.setCurrentPage(1); // just in case the new list of matched skills requires fewer pages
      resolve();
    });
  };

  // this function can be a bit heavy
  const technicalSkillFamilies = React.useMemo(
    () => invertSkillTree(technicalSkills),
    [technicalSkills],
  );

  const transferableSkillFamilies = React.useMemo(
    () => invertSkillTree(transferableSkills),
    [transferableSkills],
  );

  return (
    <>
      <h3
        data-h2-font-size="b(h4)"
        data-h2-font-weight="b(700)"
        data-h2-margin="b(bottom, m)"
      >
        {intl.formatMessage({
          defaultMessage: "Skills as filters",
          description: "Title for the skill filters on search page.",
        })}
      </h3>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Find candidates with the right skills for the job. Use the following tabs to find skills that are necessary for the job and select them to use them as filters for matching candidates.",
          description:
            "Describing how to use the skill filters on search page, paragraph one.",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            " Why are there a limited number of skills? It’s important that applicants and managers are pulling from the same list of skills in order to create matches.",
          description:
            "Describing how to use the skill filters on search page, paragraph two.",
        })}
      </p>
      <h4>
        {intl.formatMessage({
          defaultMessage: "Find and select skills",
          description: "Subtitle for the skills filter on the search form.",
        })}
      </h4>
      <TabSet>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "Technical skills",
            description:
              "Button text for the technical skills tab on skills filter",
          })}
        >
          <SkillFamiliesRadioList
            skillFamilies={technicalSkillFamilies}
            callback={(checked) =>
              handleSkillFamilyChange(checked, SkillCategory.Technical)
            }
          />
          <SkillResults
            title={intl.formatMessage(
              {
                defaultMessage: "Results ({skillCount})",
                description: "A title for a skill list of results",
              },
              { skillCount: filteredTechnicalSkills.length },
            )}
            skills={technicalSkillsPagination.currentTableData}
            addedSkills={addedSkills}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
          <Pagination
            ariaLabel={intl.formatMessage({
              defaultMessage: "Technical skills results",
              description: "Title for technical skills pagination",
            })}
            color="primary"
            mode="outline"
            currentPage={technicalSkillsPagination.currentPage}
            pageSize={resultsPaginationPageSize}
            totalCount={filteredTechnicalSkills.length}
            handlePageChange={(page: number) =>
              technicalSkillsPagination.setCurrentPage(page)
            }
            handlePageSize={technicalSkillsPagination.setPageSize}
          />
        </Tab>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "Transferable skills",
            description:
              "Button text for the transferable skills tab on skills filter",
          })}
        >
          <SkillFamiliesRadioList
            skillFamilies={transferableSkillFamilies}
            callback={(checked) =>
              handleSkillFamilyChange(checked, SkillCategory.Behavioural)
            }
          />
          <SkillResults
            title={intl.formatMessage(
              {
                defaultMessage: "Results ({skillCount})",
                description: "A title for a skill list of results",
              },
              { skillCount: filteredTransferableSkills.length },
            )}
            skills={transferableSkillsPagination.currentTableData}
            addedSkills={addedSkills}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
          <Pagination
            ariaLabel={intl.formatMessage({
              defaultMessage: "Transferable skills results",
              description: "Title for transferable skills pagination",
            })}
            color="primary"
            mode="outline"
            currentPage={transferableSkillsPagination.currentPage}
            pageSize={resultsPaginationPageSize}
            totalCount={filteredTransferableSkills.length}
            handlePageChange={(page: number) =>
              transferableSkillsPagination.setCurrentPage(page)
            }
            handlePageSize={transferableSkillsPagination.setPageSize}
          />
        </Tab>
        <Tab
          text={intl.formatMessage({
            defaultMessage: "By keyword",
            description:
              "Button text for the search skills tab on skills filter",
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
                skillCount: searchSkills.length,
              },
            )}
            skills={searchSkillsPagination.currentTableData}
            addedSkills={addedSkills || []}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
          <Pagination
            ariaLabel={intl.formatMessage({
              defaultMessage: "keyword search skills results",
            })}
            color="primary"
            mode="outline"
            currentPage={searchSkillsPagination.currentPage}
            pageSize={resultsPaginationPageSize}
            totalCount={searchSkills.length}
            handlePageChange={(page) =>
              searchSkillsPagination.setCurrentPage(page)
            }
            handlePageSize={searchSkillsPagination.setPageSize}
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
      <AddedSkills
        skills={addedSkills}
        onRemoveSkill={handleRemoveSkill}
        showHighAlert={false}
      />
    </>
  );
};

export default AddSkillsToFilter;
